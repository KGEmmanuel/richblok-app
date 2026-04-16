# Railway preview deploy — `migrate-angular-17` → merge to master runbook

This is the step-by-step to deploy the Angular 9 → 17 migration branch to a
Railway preview environment, run the smoke test, and merge to master.

## 1. Create the preview service on Railway

1. Open [railway.app](https://railway.app) → your Richblok project dashboard.
2. Click **+ New → GitHub repo** (or **+ New Service → Deploy from GitHub repo**
   if the repo is already connected).
3. Choose the `richblok-app` repo.
4. Under **Deployment Trigger**, pick **Branch** → `migrate-angular-17`.
5. Name the service `richblok-preview` (or similar — keep it distinguishable
   from the production service).
6. Save. Railway will start building immediately using `Dockerfile` +
   `railway.json` already in the repo.

## 2. Copy production env vars to the preview service

The preview needs the **same env vars** as production, otherwise flows that
call Firebase / Stripe / Anthropic will fail.

Easy copy path:
1. On the `richblok-app-production-86b6` service → Variables tab.
2. Click **Copy all** (gear icon → Copy to clipboard).
3. On `richblok-preview` → Variables tab → **Paste** → **Save**.

Minimum vars required for the full smoke test:

| Var | What it powers |
|---|---|
| `ANTHROPIC_API_KEY` | STAR Mapper, AI Coach (SSE), CV extract |
| `CLAUDE_MODEL`, `CLAUDE_HAIKU_MODEL` | Model selection |
| `FIREBASE_PROJECT_ID` | Firestore REST reads (badge OG) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | admin SDK writes from webhook handlers |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Checkout + webhook |
| `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_EMPLOYER_STARTER`, `STRIPE_PRICE_EMPLOYER_PRO`, `STRIPE_PRICE_SPONSOR_CHALLENGE` | Stripe product price IDs |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WA_FROM` | Optional; pod nudge delivery works in dry-run mode without these |
| `PODS_CRON_SECRET` | Shared secret for `/api/pods/nudge` + `/api/pods/deliver` crons |

**One change to make on the preview:** set `ENABLE_SSR=1` if you want to
verify the Angular Universal runtime render on marketing routes. Otherwise
leave unset and SSR stays opt-in.

## 3. Wait for build → verify /api/health

- Build takes ~3-4 minutes on Railway (Docker image with 40+ npm deps).
- Once live, Railway prints the preview URL (something like
  `https://richblok-preview-production.up.railway.app`).
- Open `https://<preview-url>/api/health` → should return
  `{"status":"ok","aiConfigured":true,...}`.

If `/api/health` fails:
- Railway build log → grep for `ERROR` / `Error:` / `not found`.
- Check that the Dockerfile COPY'd both `dist/` and `dist-server/`.
- Check that env vars are populated (at minimum `PORT=8080` is default).

## 4. 10-flow smoke test (manual, takes ~20 minutes)

Do each of these against the preview URL. Tick the box once verified.

- [ ] **Login with email+password** — go to `/sign-in`, enter test creds, confirm
      redirect to `/feed` and user avatar appears in header.
- [ ] **Google OAuth** — `/sign-in` → Google button → OAuth flow → redirect to
      `/feed`. Check Firebase Console → Authentication → Users shows the new
      sign-in.
- [ ] **Challenge submission + badge creation** — `/evaluate` → pick a
      challenge → answer 20 questions → submit. Confirm:
  - [ ] Redirected to `/star/:id?fromChallenge=1`
  - [ ] 5+ STAR answers rendered
  - [ ] Firestore → `badges` collection has a new doc
- [ ] **STAR profile generation** — same flow as above; confirm the STAR
      answers reference the actual project title + skills, not generic text.
      Check Network tab: `/api/star-map` returned `mode:'ai'` (not
      `fallback_error`).
- [ ] **AI Coach SSE streaming** — on `/star/:id`, click "Practice with AI
      Coach" → type "make my Result stronger" → hit send. Confirm:
  - [ ] Text streams char-by-char (not all at once) with a blinking cursor
  - [ ] Network tab: `/api/coach/stream` is `text/event-stream`
- [ ] **CV upload → STAR draft** — go to `/onboard` → drop any PDF resume →
      wait for extraction → click "Generate my STAR story library". Confirm:
  - [ ] `/api/cv-extract` returns extracted experiences
  - [ ] `/api/cv-to-star` returns draft STAR answers (`mode:'ai'`)
  - [ ] Redirect to `/star/:id?fromCv=1`, all answers show "● Draft" chip
- [ ] **Employer dashboard competency filter** — `/employer/dashboard` → use
      the Behavioral competency dropdown → confirm the candidate list filters
      down (not just showing everyone regardless of selection).
- [ ] **University dashboard pilot-preview** — `/university/dashboard` → confirm
      the yellow "Pilot preview" banner renders and the cohort table shows
      aggregate data (expected for a non-`university_admin` user).
- [ ] **Admin challenge editor CRUD** — need a Firestore user with
      `role: 'admin'`. Log in as that user → `/admin/challenges` → click
      "+ New challenge" → fill form → save. Confirm new challenge appears in
      `/evaluate` catalog.
- [ ] **Stripe checkout redirects** — `/settings` → "Upgrade to Pro" → confirm
      redirect to `checkout.stripe.com`. Don't actually pay; just verify the
      redirect lands on Stripe's hosted page. Repeat for employer license
      and sponsored challenge.

Nice-to-have extras:
- [ ] Pod auto-match — start a challenge while logged in; confirm the green
      "Accountability pod ready" banner appears with a WhatsApp invite link.
- [ ] Service Worker — open DevTools → Application → Service Workers. Confirm
      `ngsw-worker.js` is activated and running.
- [ ] Bundle size — DevTools → Network → Disable cache → hard refresh. Compare
      initial JS against master's `main-es2015.*.js` (should be 15-20% smaller
      thanks to the Angular 17 single-bundle + 6 lazy chunks).

## 5. If anything fails

- **Specific flow fails** → open the failing file in the `migrate-angular-17`
  branch. Git blame will point at the migration commit that changed it. The
  fix is usually a missing standalone `imports:` entry or a dep that lost
  its Angular 16 compat.
- **Everything fails** → deploy log will show a stacktrace. Most likely
  culprit: missing env var. Check step 2.
- **Report back** any broken flow in the PR description before merging.

## 6. Merge to master

Once all 10 flows pass on preview:

```bash
git checkout master
git pull
git merge --no-ff migrate-angular-17
# Resolve conflicts if any (unlikely since master hasn't moved)
git push origin master
```

The production Railway service will auto-deploy the merged commit. Watch
`/api/health` for a green status — the new Angular 17 bundle is live.

## 7. Clean up the preview

Once merged + production verified:
- Railway dashboard → `richblok-preview` service → Settings → Delete.
- Optionally delete the `migrate-angular-17` branch locally + remote:
  `git branch -d migrate-angular-17 && git push origin --delete migrate-angular-17`.

## Rollback plan

If production breaks after the merge:
```bash
git revert -m 1 <merge-commit-sha>
git push origin master
```
Railway redeploys the revert in ~4 min. Zero-downtime rollback.

The 12 migration commits are atomic — if you only want to roll back to a
specific stage (e.g. keep Stages 1-3 but drop Stage 4+), cherry-pick or
interactive-rebase. Full commit list is in
[ANGULAR_17_MIGRATION_PLAN.md](./ANGULAR_17_MIGRATION_PLAN.md).
