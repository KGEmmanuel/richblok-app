# B5 — Rename Railway service `vpa-core` → `richblok-app`

## Why this is cosmetic

The service name on Railway doesn't affect any runtime behavior. Whether
it's called `vpa-core` or `richblok-app`, the service still:
- Deploys from `KGEmmanuel/richblok-app` master branch
- Serves at `https://richblok-app-production-86b6.up.railway.app`
- Reads all 9 env vars (ANTHROPIC_API_KEY, STRIPE_*, FIREBASE_*, etc.)
- Runs the Express + Angular 17 bundle

The only thing that changes is what the Railway dashboard labels the service.
After rename, the `sunny-reverence` project dashboard will show
"richblok-app" instead of "vpa-core" (matching the GitHub repo name), and
future Claude-driven sessions won't waste time on the naming confusion.

## Why I'm not doing it via Chrome automation

Renaming a Railway service can have one subtle side effect:

**Risk**: The auto-generated Railway domain (`vpa-core-production-86b6.up.railway.app`)
is tied to the service name. Renaming might regenerate the auto-domain
(e.g. to `richblok-app-production-XXXX.up.railway.app`, different suffix)
and could potentially unattach the existing `richblok-app-production-86b6.up.railway.app`
if that one was auto-generated too.

**Mitigation**: Before renaming, verify which domains the service currently
has attached in the Networking settings. If `richblok-app-production-86b6`
is listed as a **custom domain** (manually added), it stays after rename.
If it's listed as an **auto-generated domain** (part of the service's
default namespace), it may change suffix and break every live badge-share
URL a user has sent in WhatsApp/email.

I'd rather you verify this with your own eyes before clicking rename, not
after I automate it and something goes sideways at 11pm.

## Step-by-step rename (5 minutes, with the safety check)

### Step 1 — verify current domains

1. Railway dashboard → `sunny-reverence` project → click the `vpa-core` service
2. **Settings** tab → scroll to **Networking**
3. Under **Public Networking**, note every domain listed. Likely shows:
   - `vpa-core-production-86b6.up.railway.app` (probably auto-generated)
   - `richblok-app-production-86b6.up.railway.app` (may be auto OR custom)
4. **If `richblok-app-production-86b6...` is marked "Custom" or has a link
   icon**: safe to rename, this domain stays attached.
5. **If it's marked as auto-generated (same styling as vpa-core-production)**:
   pin it first — click the pencil/edit icon on that domain, find "Pin this
   domain" or "Keep after rename", enable it. Only then proceed to rename.
   If no pin option exists, add `richblok-app-production-86b6.up.railway.app`
   as a **Custom Domain** (separate button under Networking) BEFORE the rename.

### Step 2 — rename

Method A — from the service card (Railway canvas view):
1. Project dashboard → click the `vpa-core` card's **title text** directly
   (not anywhere else on the card). Railway UI allows inline-edit of the
   service name.
2. Clear the text, type `richblok-app`
3. Press Enter

Method B — from Settings (if Method A doesn't trigger edit):
1. Service → Settings → scroll to the bottom of the right sidebar menu
   for an option like "Service Name" or "Rename Service"
2. Some Railway accounts have this only under the **Danger** zone section

Method C — from the service's top-left panel:
1. With the service Settings panel open, click directly on the `vpa-core`
   text at the very top of the right panel (not the tabs). A pencil icon
   should appear on hover.

### Step 3 — verify post-rename

1. `/api/health` still returns `{status:"ok", aiConfigured:true}`:
   ```bash
   curl -s https://richblok-app-production-86b6.up.railway.app/api/health
   ```
2. Project dashboard shows `richblok-app` (not `vpa-core`)
3. All 9 env vars still set (Variables tab)
4. Latest deployment still active (Deployments tab)

### Step 4 — optional — add a railway.toml label

If you want the project's "displayName" to also say Richblok in commits
and CI logs, not just the Railway dashboard, add to `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "name": "Richblok",
  "build": { ... },
  "deploy": { ... }
}
```

(The `"name"` field shows up in Railway's deployment event logs.)

## Rollback

If rename breaks anything:
1. Rename back: `richblok-app` → `vpa-core` via the same path
2. If a domain got lost: Networking → Custom Domain → re-add
   `richblok-app-production-86b6.up.railway.app`

Total downtime in worst case: 60 seconds while Railway regenerates routes.

## Why this matters (a little)

Right now, inside `sunny-reverence`, the service is labeled `vpa-core` —
a completely unrelated name inherited from a previous project. Every
future Railway session spends 30 seconds re-discovering that `vpa-core`
actually hosts the Richblok app. Renaming is 5 min once, saves 30 seconds
forever. Small win, do it at your convenience.

## My recommendation

**Skip the rename for now.** It's cosmetic. You have bigger fish:
- Set up cron-job.org (B4) — 2 min, enables pod nudges
- Ship `/feed` V5 merge (back to the main track)
- Implement PRD v4 F17 AI-pair challenge (the revenue move)

Come back to B5 on a quiet Sunday afternoon. 5-minute rename, verify the
health check, done.
