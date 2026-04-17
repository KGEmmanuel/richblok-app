# Cron setup for Richblok pod nudges

Railway's native "Cron Schedule" feature on the main service would convert it
into a job-mode service that stops between ticks — breaking `/feed`, `/api/*`,
etc. So we use an **external cron service** to hit our public pod endpoints
on schedule.

## Setup (5 minutes, free, no code changes)

### Why cron-job.org

- Free up to 50 jobs, 60-second minimum interval
- No signup email required (can use anonymous cron)
- Reliable uptime, visible execution history
- HTTP-based — perfect for pinging our public endpoints
- Alternatives: `easycron.com`, `cronitor.io`, GitHub Actions cron,
  cloudflare Workers cron. Pick whichever you prefer; setup is similar.

### Two cron jobs to create

Both hit the same base URL with different paths + the shared secret:

```
https://richblok-app-production-86b6.up.railway.app
```

#### Job 1: Pod nudge emitter

- **URL**: `https://richblok-app-production-86b6.up.railway.app/api/pods/nudge?secret=cfb319cb3b2a677fc501ba71fb46b1db293aaca197e03e92`
- **Method**: GET
- **Schedule**: weekly, Monday 9:00 UTC (`0 9 * * 1` in CRON syntax)
- **Expected response**: `{"emitted":N}` where N is the number of pods that
  had a nudge record written
- **What it does**: For each active accountability pod (4-6 people doing the
  same challenge in the last 7 days), writes a `pod_nudges` Firestore
  document so the delivery worker can pick it up. Idempotent — re-running
  the same day produces 0 new emissions because each pod's `lastNudgeAt`
  is within the 7-day window.

#### Job 2: Pod nudge delivery worker

- **URL**: `https://richblok-app-production-86b6.up.railway.app/api/pods/deliver?secret=cfb319cb3b2a677fc501ba71fb46b1db293aaca197e03e92&limit=20`
- **Method**: GET
- **Schedule**: every 30 minutes (`*/30 * * * *`)
- **Expected response**: `{"twilioConfigured":true, "delivered":N, "skipped":M, "errors":0}`
  — until Twilio env vars are set, `twilioConfigured` will be `false` and
  nudges stay in dry-run (recorded in Firestore without sending).
- **What it does**: Pulls undelivered `pod_nudges` records, resolves each
  member's phone from `utilisateurs/{uid}.phone`, sends via Twilio WhatsApp
  Business API, marks delivered. Failures leave delivered=false for retry.

## Step-by-step on cron-job.org

1. Visit [cron-job.org](https://cron-job.org) → **Create Free Account**
   (or click "cronjob - without registration" for anonymous mode)
2. Click **+ Create cronjob**
3. For Job 1 (nudge emitter):
   - Title: `Richblok pod nudge emitter (weekly)`
   - URL: paste the nudge URL from above
   - Schedule: "Execution schedule" → Custom → CRON expression `0 9 * * 1`
   - Timezone: UTC
   - Save
4. Click **+ Create cronjob** again
5. For Job 2 (delivery worker):
   - Title: `Richblok pod nudge delivery (every 30 min)`
   - URL: paste the deliver URL from above
   - Schedule: "Every 30 minutes" preset
   - Save
6. **Verify**: on the first Monday after creating Job 1, check the execution
   log — should show a 200 response with `{"emitted":N}`. For Job 2, check
   the log within an hour — should show 200 response with the delivery JSON.

## Security note on the URL-embedded secret

The `?secret=cfb319cb3b2a677fc501ba71fb46b1db293aaca197e03e92` parameter is
in the URL (not a header) because cron services typically support URLs but
not custom headers. The server-side check in `server.js` at
`/api/pods/nudge` and `/api/pods/deliver` verifies `req.query.secret`
against `process.env.PODS_CRON_SECRET` and returns 401 on mismatch.

**The secret is low-risk** — it ONLY gates two cron endpoints. Leaked secret
lets someone trigger pod matching/delivery, which is idempotent and only
affects Richblok's own Firestore. No financial impact, no data exfiltration
possible. Rotating the secret means:
1. Generate a new 48-char hex: `python -c "import secrets; print(secrets.token_hex(24))"`
2. Update `PODS_CRON_SECRET` on Railway service Variables
3. Update both cron job URLs with the new value
4. Redeploy Railway service

## Alternative: GitHub Actions cron

If you'd rather keep all infra under your own GitHub, a `.github/workflows/pods-cron.yml`
like this works:

```yaml
name: Pods cron
on:
  schedule:
    - cron: '*/30 * * * *'   # every 30 min — deliver
    - cron: '0 9 * * 1'      # weekly Mon 9am UTC — nudge
jobs:
  deliver:
    if: github.event.schedule == '*/30 * * * *'
    runs-on: ubuntu-latest
    steps:
      - run: curl -sS "https://richblok-app-production-86b6.up.railway.app/api/pods/deliver?secret=${{ secrets.PODS_CRON_SECRET }}&limit=20"
  nudge:
    if: github.event.schedule == '0 9 * * 1'
    runs-on: ubuntu-latest
    steps:
      - run: curl -sS "https://richblok-app-production-86b6.up.railway.app/api/pods/nudge?secret=${{ secrets.PODS_CRON_SECRET }}"
```

Requires adding `PODS_CRON_SECRET` to the repo's GitHub Actions Secrets.
GitHub Actions cron is free for public repos, but schedules can lag 5-15
minutes during peak GitHub load — fine for pods, not ideal for latency-
sensitive jobs.

## Alternative: Railway sidecar cron service

If you want all infra in Railway, create a second service in the
`sunny-reverence` project:

1. Railway dashboard → sunny-reverence → **+ New Service** → Empty service
2. Name: `richblok-pods-cron`
3. Variables: add `PODS_CRON_SECRET` (reference-type — points at the main
   service's variable so they stay in sync)
4. Settings → Build → Custom build command: `(none)`
5. Settings → Deploy → Custom start command:
   ```
   sh -c 'while true; do sleep 1800; curl -sS "https://richblok-app-production-86b6.up.railway.app/api/pods/deliver?secret=$PODS_CRON_SECRET"; done'
   ```
6. This keeps a long-running container that hits the endpoint every 30 min.
   Not ideal (sleeping containers cost money), but keeps infra unified.

**Recommended: Option A (cron-job.org)**. Free, no Railway compute, visible
execution history. Takes 2 minutes to set up.

## When to actually enable delivery

Right now with Twilio not configured, `/api/pods/deliver` returns
`twilioConfigured:false` and runs in dry-run mode. The cron can run safely
— it just records intended messages in Firestore without sending. Set up
the cron now; when you're ready to actually deliver WhatsApp nudges, add
the three `TWILIO_*` env vars on Railway and redeploy. No cron changes
needed.
