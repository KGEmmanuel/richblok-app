# V5 Sprint 1 path decision — April 2026

**Status**: decided. Path B (defer the UI overhaul, ship PRD v4 features next)
**Revisit**: after 2 weeks of production observation on the new `/feed` (once
V5 Sprint 0 merges) OR when a designer / second engineer joins.

---

## Background (where we are)

V5 Sprint 0 shipped:
- Canonical UI kit (7 atoms + molecules) under `src/app/shared/ui/`
- Design tokens (`tokens.scss`) — single source of truth for color, type, motion
- Lucide icons registered globally via AppModule
- `/feed` rewritten as premium personal dashboard (lazy-loaded, zero Bootstrap)
- 63 legacy image assets + 3 PSDs purged

V5 Sprint 1 was planned to continue with Tier-1 page migrations:
- `/record`, `/evaluate`, `/jobs`, `/profile`, `/participate-to-challenge`
- Plus `<rb-app-shell>` + `<rb-public-shell>` extraction

Estimated effort: **4-5 more sessions solo**, or 2-3 with a designer paired.

---

## The three options considered (from V5 Appendix D)

1. **Continue solo** — migrate all 5 remaining Tier-1 pages session-by-session.
2. **Pause for designer hire / second engineer** — freeze V5 work until the
   team can pair on it; ships higher-fidelity, more consistent polish.
3. **Hybrid** — migrate the highest-traffic page (`/record`) solo, then pause.

## The parallel question

Even more important than "which V5 option": should we migrate **more UI** or
ship **more product**?

PRD v4 has 8 features (F17-F24) that drive the AI-native thesis. None have
shipped. They are what make the $10K-MRR revenue path real:

| Feature | What it unlocks |
|---|---|
| F17 AI-pair challenge | The core product primitive |
| F18 Transcript ingestion | On-ramp for existing AI-users |
| F19 AI-competency STAR tags | Makes F17 credentials meaningful |
| F20 Tool-agnostic badge metadata | Keeps us vendor-neutral |
| F21 Vendor-sponsored challenges | Revenue ($2-5K / sponsorship) |
| F22 Employer "verified AI-native" filter | Closes the employer signal gap |
| F23 `/ai-native` discovery page | SEO growth |
| F24 Weekly leaderboard + WhatsApp | Growth loop |

Implementing F17 + F18 + F19 takes ~1 week solo. The AI infrastructure is
already live (`aiConfigured: true` on production, three endpoints smoke-tested
green). The challenge engine, STAR mapper, badge system all exist — F17-F19
are mostly additive on those.

---

## Decision: Path B — defer V5 Sprint 1, ship PRD v4 next

### Rationale

1. **V5 Sprint 0 already fixed the worst dissonance.** The three most-visited
   logged-out surfaces (landing, onboard, sponsor) are premium. The single
   most-visited logged-in surface (`/feed`) is now premium. The remaining
   legacy pages (`/record`, `/evaluate`, `/jobs`, `/profile`,
   `/participate-to-challenge`) hurt but don't destroy the user journey.

2. **PRD v4 is what moves revenue.** Nothing in V5's remaining UI work moves
   the $10K-MRR needle. F17 (AI-pair challenges) + F21 (sponsored) directly
   move it. Technical debt payment is infinite; revenue signals are urgent.

3. **Premium UI work scales better with a designer paired.** The 7 UI kit
   components we shipped are the scaffolding. The remaining migrations are
   1000-line SCSS rewrites per page. A designer's 20% time input produces
   80% of the visual quality. Solo, we spend 100% of time and produce 70%
   quality. Worth waiting.

4. **The current state is safely-merge-able.** V5 Sprint 0 + the
   standalone-shared-components branch together take master from "33 legacy
   Bootstrap pages" to "26 legacy + 7 premium + 12 standalone widgets
   lazy-loadable." That's a defensible pause point.

5. **Observing real user behavior on the new `/feed` is a dependency.**
   Before investing 4-5 more sessions on the same pattern, we want to see:
   - Does the new dashboard actually increase challenge-start rate?
   - Do users complete more STAR stories when they see clear activity?
   - Does the Pro-upgrade conversion move?
   If the pattern works → continue with Tier 1. If it doesn't → rethink
   before duplicating it 5 more times.

### What this means concretely

**Do NOT do next session:**
- `/record` migration
- `/evaluate` migration
- `/jobs` migration
- Any other Tier-1 UI rewrite

**Do next session:**
- Start **F17 AI-pair challenge format** (the core product primitive)

**After F17 ships:**
- F18 transcript ingestion (reuses CV extract pipeline, ~2 days)
- F19 add 3 AI-competency STAR tags to taxonomy (~half day)
- F20 tool-agnostic badge metadata (~1 day)

**When to revisit V5 Sprint 1:**
- Designer hired or second engineer onboarded
- OR 2 weeks of production telemetry shows the `/feed` rewrite moves a funnel
  metric by ≥10% — validates the pattern is worth replicating
- OR a user-reported UX complaint ties specifically to one of the remaining
  legacy pages (e.g. `/record` blocking a user from completing profile setup)

### Merge order for what's currently stacked

```
master (Angular 17 production)
├── v5-sprint-0-ui-kit    ← merge FIRST (after /feed icons verified)
└── standalone-shared-components  ← merge SECOND (stack on top)
```

After both are in master, open a new branch `feat/f17-ai-pair-challenge`
and start PRD v4 work there.

### Cleanup tasks that can happen in parallel (do while observing)

- Rename Railway service `vpa-core` → `richblok-app` (B5)
- Set remaining Railway env vars: `FIREBASE_SERVICE_ACCOUNT_JSON`, Stripe
  keys, price IDs, Twilio, cron secret (B3)
- Configure Railway cron for `/api/pods/nudge` + `/api/pods/deliver` (B4)
- Send smoke test results + case study framing to the content roadmap for PRD v4

---

## How this decision gets reviewed

Every 2 weeks starting now:
1. Pull production telemetry — `/feed` engagement, challenge starts, Pro
   conversions, support tickets mentioning specific pages
2. Check PRD v4 sprint progress — is F17 landing on time?
3. Re-evaluate V5 Sprint 1: new urgency? new resources?

If 2 weeks pass with no answer to those checkpoints → decision holds.
If data shifts (e.g. `/record` becomes a conversion blocker) → revisit
immediately, don't wait for the 2-week check.

---

*Decision made April 16, 2026. Author: Richblok founding team + Claude.*
