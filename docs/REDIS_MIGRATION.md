# Redis migration plan for F17 rate-limit + concurrency state

## Status: deferred — in-memory is correct for current scale

Today both the per-uid daily rate limit and the outbound-call concurrency
gate live in `server.js` module-level state:

- `aiPairRateBuckets` — `Map<uid, {windowStart, count}>`
- `aiPairActiveCount` — plain counter, max 10

This is **intentional**. While we run a single Railway container, the
in-memory state IS the authoritative state. Redis would add:

- A new network dependency in the hot path of every scoring call
- One more credential to rotate (`REDIS_URL`)
- One more service to pay for
- Round-trip latency on every rate-check (~1-5ms per call)

…for zero correctness improvement at our current topology. One node, one
state store (its own RAM). Simple is correct.

## When to migrate — explicit triggers

Flip to Redis the moment **any one** of these becomes true:

### Trigger 1 — horizontal scale (more than 1 Railway replica)

Railway's "Replicas" setting going from 1 → 2+ instantly breaks both
mechanisms:

- **Rate limit** leaks: a user who hit the cap on replica A just retries
  and lands on replica B with a fresh bucket. Real-world cap becomes
  `N × replicas` instead of N.
- **Concurrency gate** leaks: each replica counts independently, so the
  effective cap is `10 × replicas` parallel Claude calls. Not catastrophic
  (Anthropic will rate-limit eventually) but defeats the point.

### Trigger 2 — zero-downtime deploys

Railway's rolling deploy strategy spins up a new container while the old
one still serves traffic for ~60s. During that overlap, **both** have
their own in-memory state. The overlap is short enough that we've accepted
it today, but if it ever matters (e.g. a pentest flags "can be bypassed
via redeploy timing"), that's the trigger.

### Trigger 3 — sustained > 30 scorings/day total

Right now the rate limiter is near-useless because almost no one hits the
10/uid cap. When aggregate scoring volume grows to the point where we
want to track **global** rate (e.g. "total Claude spend per hour"),
we'll need shared state. The in-memory path doesn't extend to a global
counter without a refactor anyway.

### Trigger 4 — we add a second server process

E.g. a separate worker that processes the `pending_review_queue` on a
timer and auto-retries failed scorings. That worker needs to share rate
state with the Express server or it'll hammer Anthropic independently.

## What a Redis swap looks like (~1h when the trigger fires)

Both helpers are single-file, single-responsibility. The diff is small.

### Before (today)

```js
// in server.js
const aiPairRateBuckets = new Map();
function aiPairRateCheck(uid) {
  const now = Date.now();
  const bucket = aiPairRateBuckets.get(uid);
  if (!bucket || now - bucket.windowStart >= AI_PAIR_WINDOW_MS) {
    aiPairRateBuckets.set(uid, { windowStart: now, count: 1 });
    return true;
  }
  if (bucket.count >= AI_PAIR_DAILY_LIMIT) return false;
  bucket.count++;
  return true;
}

let aiPairActiveCount = 0;
function aiPairAcquireSlot() { /* ... */ }
function aiPairReleaseSlot() { /* ... */ }
```

### After

```js
// npm i ioredis
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

async function aiPairRateCheck(uid) {
  // Atomic increment + TTL. First call creates the key with TTL 24h.
  const key = `ai_pair:rate:${uid}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 24 * 60 * 60);
  return count <= AI_PAIR_DAILY_LIMIT;
}

// For concurrency: redis INCR/DECR is atomic across replicas.
async function aiPairAcquireSlot() {
  const count = await redis.incr('ai_pair:active');
  if (count > AI_PAIR_MAX_CONCURRENT) {
    await redis.decr('ai_pair:active');  // roll back
    return false;
  }
  return true;
}
async function aiPairReleaseSlot() {
  await redis.decr('ai_pair:active');
  // Floor at 0 in case of a crash that missed a release:
  const count = await redis.get('ai_pair:active');
  if (parseInt(count) < 0) await redis.set('ai_pair:active', '0');
}
```

### Handler changes

Only two — both `aiPairRateCheck(uid)` and `aiPairAcquireSlot()` become
`await`-able. Add `await` in the two call sites. That's it. Response
shapes unchanged, client unaware.

### Operational

- Railway supports Redis as a first-class plugin (one-click provision).
- `REDIS_URL` env var gets auto-injected into the main service.
- Replicas can go > 1 immediately after the swap.
- `ioredis` handles reconnection automatically; if Redis is down the
  rate-check should **fail open** (grant the request) — we don't want
  Redis outage to block scoring. Add a try/catch around the INCR that
  returns `true` on error.

## Invariants to preserve

Whatever the swap, the following tests (today in
`test/server/ai-pair-score.test.js`) must still pass:

- `AI_PAIR_DAILY_LIMIT === 10`
- `AI_PAIR_MAX_CONCURRENT === 10`
- Fresh state after `__test.resetAiPairState()` (test hook needs a
  Redis flush equivalent — e.g. `DEL ai_pair:*`)
- 429 response when limit exceeded
- 503 + Retry-After when concurrency exceeded

Those tests are the contract — Redis-impl is an implementation detail.
