# F21 — AI-vendor sponsored challenge outreach

## Status: code stub + outreach template ready; actual BD is your work

Tier D4 is "ongoing business development", not code. This doc stubs the
coding surface a sponsored challenge needs, and drafts the outreach
email you send to Anthropic, Cursor, Cognition, Replit, OpenAI Codex,
Windsurf, Lovable, v0, and Bolt.

## What the product already does today

- `Challenge.sponsored?: boolean` + sponsor branding fields exist
  (see `SponsorChallengeComponent` at `/sponsor`).
- Badges stamp `ai_tool_used`, so a Cursor-sponsored challenge produces
  badges that say "Cursor Verified" in the discovery page metadata.
- `/ai-native` lists top 100 badges; a sponsored challenge's top
  performers are already surfaced publicly.
- Admin dashboard has a manual challenge CRUD (`/admin/challenges`)
  so a sponsor-specific challenge can be created immediately.

## What's missing for a real sponsored-challenge flow

1. **Sponsor account onboarding** — today there's no "sponsor" role.
   A sponsor who wants a branded challenge + visibility into their
   performers should have:
   - A sponsor-admin console at `/sponsor/:sponsorSlug/dashboard`
   - CRUD for their own challenges
   - Read access to anonymized performer metrics (pass rate,
     avg verification score, tool-usage breakdown)
   - Read access to opt-in introduction requests from their challenges
2. **Payment flow** for sponsorship — Stripe price IDs already exist
   for challenge sponsorship ($500 one-time). Hook to `/sponsor` route
   needs a Stripe checkout session.
3. **Badge co-branding** — currently badges have a generic "Richblok"
   watermark. Sponsored badges should show "Powered by {sponsor}"
   with the sponsor's logo. One extra field on the badge doc +
   conditional render in `/badge/:id`.

**None of these are blockers for the first outreach.** You can sell
a co-branded AI-pair challenge TODAY and deliver it via the existing
admin CRUD. The sponsor gets: branded challenge + performer list at the
end of each month (you email them the top 20). The MVP path.

## Outreach email template (customize per vendor)

Subject line pattern: `{Vendor} + Richblok — verified {ToolName}
developers for African tech hiring`

```
Hi [first name],

I'm Guillaume, founder of Richblok — we issue verified skill badges
to African tech talent via timed, AI-reviewed challenges.

Today, developers earn Richblok badges using Claude Code, Cursor,
Copilot, and {vendor name}. Every badge has a `ai_tool_used` field
that says which tool they used. It's public:
  https://richblok-app-production-86b6.up.railway.app/ai-native

We're running 4 challenges right now. One of them is a rate-limit
debug that specifically tests whether the candidate pushed back on
their AI when it was wrong — the scarce signal employers hire on.

I'd like to ship a {vendor}-sponsored challenge. Here's the pitch:

  — We brand the challenge "Verified {ToolName} Developer" + your
    logo on every badge earned.
  — 100% of candidates who take it use {ToolName}, explicitly declared
    in their transcript. Great for case studies and ad-creative.
  — You get the monthly top-20 list: name, score, verification score,
    cost-consciousness score. Opt-in so it's spam-free.
  — First-mover advantage: whoever sponsors first gets the featured
    position on /ai-native (top of page, permanent).

Pricing: $2,500 for a 90-day sponsored challenge, first one at $500
as a pilot. You keep 100% of employer introductions that come through
the challenge — we don't take a cut.

Interested in a 15-minute call? I can ship the branded challenge
within 48 hours of a signed agreement.

— Guillaume
  Richblok · richblok.com
```

## Contact priorities (who to email first)

1. **Anthropic** — already the default AI tool on the F17 challenge
   dropdown. Natural fit. Their developer-relations team is public:
   `devrel@anthropic.com` or the "Claude Code" team directly.
2. **Cursor** — Cursor-sponsored would be high-signal; their audience
   overlaps ours. Anysphere team via their careers page or
   `hi@cursor.com`.
3. **Cognition Labs (Devin)** — Devin's positioning is "AI engineer,"
   closest to our brand. Their investor list is public; reach via
   Scott Wu's Twitter or `team@cognition-labs.com`.
4. **Replit** — Replit Agent is becoming more polished; their
   developer-advocacy budget is larger than most.
   `support@replit.com` or Amjad Masad directly.
5. **Vercel (v0)** — v0 is frontend-specific; Richblok has frontend
   challenges too. `hello@vercel.com` to DevRel.
6. **Windsurf (Codeium)** — newer, may be most receptive to paid
   distribution: `team@codeium.com`.
7. **Lovable / Bolt.new** — smaller, more budget-conscious; mention
   the $500 pilot tier.
8. **GitHub Copilot** — Microsoft, long sales cycle. Last on the list.

## Measuring success

Simple metric: `count(badges.where(sponsorSlug == X AND passed))` over
30 days. A sponsor expects this to trend up month-over-month. If it
plateaus, the challenge brief needs iteration.

## Code stub deferred

Sponsor-admin console + payment flow + co-branded badge render are
each ~1-day lifts. **Do the outreach first.** If a vendor says yes,
we can ship the dashboard in parallel with contract-signing. Don't
build the dashboard speculatively.
