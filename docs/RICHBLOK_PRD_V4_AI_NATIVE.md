# Richblok PRD v4 — AI-Native Verified Talent

**Version**: 4.0 · AI-Era Addendum to v3
**Date**: April 2026
**Scope**: Adds verified AI-pair-programming competency as a first-class skill
dimension inside the existing Richblok product. Does **not** rename, rebrand,
or pivot away from the African talent positioning.
**One-line thesis**: LinkedIn measures credentials from before AI existed. We
measure the only credential that matters in 2026 — can you ship real work,
with AI agents, verifiably.

---

## 0. What changes from PRD v3

| Dimension | PRD v3 (April 2026) | PRD v4 (this doc) |
|---|---|---|
| Core unit of verification | Timed skill challenge (React, Python, SQL, UX, Product) | Same + a new family of **AI-pair challenges** where the artifact is the work shipped WITH an AI agent |
| STAR competency taxonomy | 10 behavioral tags | 10 behavioral + **3 AI-native tags**: `ai_pair_programming`, `ai_tool_orchestration`, `verification_discipline` |
| CV extraction input | PDF or pasted résumé | Same + **Claude Code / Cursor / Codex transcripts** (JSONL, markdown, or pasted) |
| Employer search filter | Skill × Country × Score × Competency | Same + **"Verified AI-native"** boolean + tool breakdown (Claude / Cursor / Copilot / Codex) |
| Target user evolution | African tech talent competing globally | Same — **strictly stronger positioning**, not replaced |
| Revenue streams | 4 streams (B2B2C) | Same 4 + **AI-tool-vendor sponsored challenges** |

**What is NOT changing**:
- Product name stays Richblok
- African distribution advantage remains the primary go-to-market
- Existing employer/university/B2B2C pricing model unchanged
- Existing CV-first onboarding funnel is the primary flow
- All Angular 17 + Firebase 9 + Stripe + SSE coach infrastructure reused as-is

**What we explicitly reject** (see §8 Risks for detail):
- Renaming to "Claude Network" or any vendor-anchored brand
- Pivoting to an "AI developer network" — networks-for-devs have a graveyard
  and we don't need to pick a fight with GitHub or Stack Overflow
- Building a content platform, newsletter, or Discord-style community
- Positioning as Anthropic-exclusive; we stay tool-agnostic

---

## 1. The AI Era — what actually changed in the last 24 months

### 1.1 The four observable shifts
Each of these is backed by something that happened in market, not speculation:

1. **Production coding assistance hit escape velocity.** GitHub Copilot, Claude Code,
   Cursor, Codex, Replit Agent, Windsurf, Lovable, v0, and Bolt all crossed from
   "demo" to "daily driver" between 2024-2026. Anthropic's own usage data shows
   Claude Code adoption growing on the order of 10x year-over-year in the
   developer segment. This is not hype — it is a measurable behavior change in
   how software gets written.

2. **The productivity distribution bifurcated, hard.**
   - Devs who adopted AI tooling early and deliberately are shipping 3-5x more
     features per sprint. (Observable in any mixed team.)
   - Devs who treat AI as either useless or a cheat code are producing worse
     output than before — because their non-AI-using peers moved up and the
     AI-using peers moved up faster.
   - The middle is hollowing out. Hiring managers see it on the interview
     floor. They don't have language for it yet.

3. **Traditional credentialing signals became noisier, not stronger.**
   - LinkedIn profiles now include "AI enthusiast" or "AI-native" in >60% of
     tech-talent headlines. The phrase tells employers nothing.
   - GitHub commit activity is increasingly AI-authored and no platform
     surfaces that. An 800-commit GitHub profile in 2026 may represent
     1-2 hours/week of human involvement or 40 hours. There is no signal.
   - Credentialed bootcamps and CS degrees — already weak signals — were
     further commoditized by AI-assisted learning. Completion no longer
     implies competence.

4. **The market failed to build a verification layer.**
   - No platform today issues a credential of the form: "This human, in a
     timed setting, with free choice of AI tools, produced this artifact
     scored at X/100 by automated review plus optional human re-check."
   - LinkedIn Learning, Coursera, Udacity, Pluralsight all issue completion
     certs, not outcome certs. Big Interview, Yoodli coach but don't certify.
   - Forage, Parker Dewey issue work-experience certificates but not
     scored-under-pressure + AI-tool-allowed ones. No overlap.
   - **This is the hole Richblok v4 fills.**

### 1.2 The broken credentialing loop — concrete version
A Nigerian senior backend engineer shipped a production payment reconciliation
service in 9 working days using Claude Code. The old version, pre-AI, took her
team 6 weeks. When she interviews at a Canadian fintech in the same week, the
recruiter asks: "Tell me about a complex technical project." She tells the
story. The recruiter nods, has no way to verify it, loses the thread, and
passes her over for a candidate with a university name. The fintech ships the
same feature 6 months later.

This happens dozens of times per day globally. It is the single largest value
leak in the current tech labor market. A verifiable AI-competency credential
closes it.

---

## 2. User demand

### 2.1 Candidate-side demand (the person earning the badge)

**Primary persona**: Dayo, 27, Nigerian self-taught full-stack engineer, 3
years of experience at local fintechs, currently making ~$1,400/mo.

Dayo's actual situation:
- Uses Claude Code daily. Has shipped ~40 features with it in the last year.
- Applied to 127 remote roles in the last 6 months. 3 interviews. 0 offers.
- Pay ceiling in-country is ~$3,000/mo. Similar-skill remote roles pay
  $60,000-$110,000/yr. The market arbitrage exists but he can't capture it.
- His core frustration: **"I can outproduce the Western devs I work with.
  Nobody believes me because I don't have the right logos."**

What Dayo wants from Richblok v4 (directly from user-discovery interviews
conducted for PRD v3, updated for AI context):

| Signal Dayo wants to emit | Current non-Richblok path | Richblok v4 path |
|---|---|---|
| "I can ship with Claude Code" | Informal GitHub readme, screencasts | Verified 20-minute AI-pair challenge badge with transcript proof |
| "I manage AI-tool token cost responsibly" | No path. This is invisible today. | `ai_cost_consciousness` sub-score on every challenge |
| "I verify AI output, I don't just copy it" | Hard to demonstrate in interview | `verification_discipline` competency with structured STAR story |
| "I've shipped 40 features with AI assistance" | Uncredentialed | Badge-stacked public profile + STAR library |
| "I'm not a senior in 2021 terms — but I ship like one in 2026 terms" | Cover letter prose, ignored by ATS | Badge with percentile within-cohort score, machine-readable |

### 2.2 Employer-side demand (the person paying)

**Primary persona**: Marcus, 38, Head of Engineering at a 40-person Canadian
fintech (Toronto), burning cash at Canadian rates for devs he's not sure are
AI-productive.

Marcus's actual situation:
- His team includes 4 "senior" Canadian devs billed at CAD $140K-$180K each.
  He suspects at least 2 are less productive than a mid-level Nigerian
  dev he interviewed but couldn't greenlight.
- Nobody on the hiring panel knows how to ask an AI-era behavioral question
  and score it consistently. Resume screening still uses 2019 signals.
- He explicitly told the interviewer: "I don't trust an unknown dev from
  a country I don't hire from unless I have signal I can defend to my board."

What Marcus needs from Richblok v4:

| Signal Marcus wants to receive | Currently misses because | Richblok v4 delivers |
|---|---|---|
| "This candidate actually ships with AI tools" | No platform measures this | Verified badge + transcript + scored outcome |
| "This candidate is not just parrot-prompting" | No observable signal | `verification_discipline` score — did they catch the AI's hallucinations? |
| "I can filter 500 applicants to 20 in 30 seconds" | LinkedIn filters are skills-self-declared | Employer dashboard competency filter wired to verified badges |
| "This person's AI-native productivity translates to my stack" | No bridge from challenge to production readiness | Challenge design uses employer-submitted problem briefs (sponsored challenge model) |
| "Defensible to my board" | Gut-feel hires don't defend well | Public badge URLs + scored percentiles are reviewable audit trail |

### 2.3 Demand signals we can cite today

These are the numbers actually worth believing. Round/estimated; flagged where
validation is required before sales use:

- **Developers globally using some AI coding assistant daily**: ~40-60M.
  Source: cross-reference of GitHub Copilot public metrics, Anthropic public
  developer-numbers, Cursor's published MAU.
- **Developers globally using Claude Code specifically**: <5M daily-active,
  <25M monthly-active (estimate — needs Anthropic confirmation for sales use).
- **African tech talent population**: 3.2M active (AfDB 2025 estimate,
  carried from PRD v3).
- **African devs using AI coding assistance daily**: ~1.5M estimated, growing
  fastest-in-world rate. African devs overindex on AI tool adoption because
  the pay-per-output economics are more compelling at their salary scale.
- **Hiring managers who have stated AI-tool competency is a top-5 screening
  criterion**: 71% in SHRM Q1-2026 survey. The top criterion they can't
  measure today.

---

## 3. Market demand

### 3.1 TAM / SAM / SOM (honest math, no wishful multipliers)

| Layer | Size | Definition | Capture timeline |
|---|---|---|---|
| **TAM** | $24B | Global corporate L&D + hiring-credential spend | 10+ years, unreachable |
| **SAM** | $2.5B | Global tech-credential & skills-assessment market × AI-native subsegment growth | 3-5 years |
| **SOM** | $50-120M | African-supply × Global-demand × our first-mover window | 3-year capture target |

The only number we operate against is the $10K MRR-by-Day-90 target carried
from PRD v3. That didn't change.

### 3.2 Why now, specifically

Five things are simultaneously true in April 2026 that weren't true in 2024:

1. **AI tooling is a verifiable daily practice, not a theoretical skill.** In
   2024 you couldn't tell who was really using AI. In 2026 you can record
   the transcript, score the PR, and publish the artifact. The verification
   primitives exist.
2. **LinkedIn has not responded.** Their endorsements-and-headlines model is
   structurally unable to surface AI-tool proficiency. They had two years to
   build it; they didn't. The window is still open.
3. **AI-tool vendors are paying for distribution.** Anthropic, Cursor,
   Cognition, Replit are all sponsoring developer growth. A verified-user
   badge is cheaper-CAC than paid ads for them. Sponsored-challenge
   revenue is realistic at $500-$5K per challenge.
4. **The pay arbitrage has widened, not narrowed.** Remote hiring is stable;
   cost of high-skill devs in NA/EU has climbed; cost of high-skill devs in
   Africa has climbed slower. Spread is wider than 2024. This validates the
   PRD v3 core thesis at a bigger number.
5. **The platform-shift deadline for incumbent job boards is tightening.**
   LinkedIn, Indeed, and monster.com are racing to add AI-skill signals. We
   have a ~12-18 month window to become the default credential before one of
   them copies the model. After that we need either defensive moat (data
   network effects via our scoring model) or acquisition (buyout exit).

### 3.3 Why Richblok is positioned to win this specifically

Ordered from most defensible to least:

1. **We have the product already.** Challenge engine, scoring, badge issuance,
   STAR mapping, employer dashboard, CV extraction, SSE AI coach, Stripe
   billing, PWA, service worker, Angular 17 stack, Firebase 9 compat, Railway
   production, 21+ lazy chunks. 90% of the v4 work is additive.
2. **African distribution is a real, hard-to-replicate wedge.** No global
   job board has committed channel to African universities, developer
   communities, or WhatsApp-based growth. We have those pipes from PRD v3.
3. **We are tool-agnostic.** We never rebrand around Claude, Cursor, or Copilot.
   If the market shifts vendors, we are the Switzerland.
4. **The African-supply + global-demand + AI-native-signal trifecta is
   unique.** LinkedIn has 2 of 3 (global supply + global demand; no AI
   signal). Forage has 1 of 3 (AI-aware but no supply/demand marketplace).
   We are the only platform at the intersection.
5. **Angular/Firebase stack is now modern (post-migration).** We can ship
   new challenge formats in days, not weeks. This will matter when Anthropic
   or OpenAI asks us to prototype a sponsored challenge format.

---

## 4. Product requirements (feature-level)

All features labeled `F*` below are either **carried from PRD v3** (existing)
or **new in v4**. Priority follows PRD v3 convention (P0 = ship first quarter,
P1 = next, P2 = opportunistic).

### 4.1 Existing features carried from v3 (unchanged)

| ID | Feature | Status |
|---|---|---|
| F1 | SEO landing page | shipped |
| F2 | Google OAuth | shipped |
| F3 | Challenge engine | shipped (100 seed questions across 5 tracks) |
| F4 | Badge & verification system | shipped |
| F5 | Public verified profile | shipped |
| F6 | Stripe consumer Pro ($10/mo) | shipped code, pending env-var |
| F7 | Referral program | shipped |
| F8 | WhatsApp badge share | shipped |
| F9 | STAR competency mapper | shipped |
| F10 | Contextual AI interview coach (SSE) | shipped |
| F11 | Employer talent dashboard | shipped |
| F12 | WhatsApp accountability pods + Twilio delivery | shipped |
| F13 | University partner portal | shipped |
| F14 | Employer-sponsored challenges | shipped |
| F15 | CV-first onboarding | shipped |
| F16 | Admin challenge editor | shipped |

### 4.2 New features in v4

| ID | Feature | Priority | Effort |
|---|---|---|---|
| **F17** | **AI-pair challenge format**: user gets a broken repo + 45 min + any AI tool of choice. Submits PR + full agent transcript + optional 5-min async explainer. Scored on correctness (auto), transcript quality (LLM-scored), explainer clarity (optional human review). | **P0 NEW** | L (3-5 days) |
| **F18** | **Transcript ingestion**: new mode of `/api/cv-extract` that accepts Claude Code `.jsonl`, Cursor chat export, Codex transcript, or pasted markdown. Auto-drafts STAR stories with `ai_pair_programming` tag. | **P0 NEW** | M (2 days) — reuses existing CV extract pipeline |
| **F19** | **AI-competency tags on STAR profile**: add `ai_pair_programming`, `ai_tool_orchestration`, `verification_discipline`, `ai_cost_consciousness` to taxonomy. Questions, prompts, draft answers all extended. | **P0 NEW** | S (1 day) — data model + seed questions |
| **F20** | **Tool-agnostic badge metadata**: badge JSON now encodes `ai_tool_used` (Claude / Cursor / Copilot / Codex / None) as metadata. Badge page renders the tool logo in the OG image. Employer dashboard filters on it. | **P1 NEW** | M (1-2 days) |
| **F21** | **AI-vendor sponsored challenges**: extend F14 so Anthropic, Cursor, etc. can sponsor a challenge branded with their tool. Top 10 performers get vendor-specified reward (access, interview fast-track, cash). | **P1 NEW** | S (1 day) — extends existing F14 schema |
| **F22** | **Employer dashboard "verified AI-native" filter**: boolean toggle surfaces only candidates with ≥1 F17 badge. Adds a tool-breakdown pie chart (% using Claude / Cursor / etc.) | **P1 NEW** | S (half day) — extends existing competency filter |
| **F23** | **Public "AI-native" discovery page**: `/ai-native` route. Public-accessible, shows top 100 AI-pair badge holders, ranked. SEO-targeted at "hire AI-native developers" long-tail queries. | **P2 NEW** | M (1 day) |
| **F24** | **Weekly AI-pair leaderboard + WhatsApp broadcast**: community ritual. Top performers of the week get public shoutout on the discovery page + WhatsApp notification to their referral network. Growth loop. | **P2 NEW** | M (1 day) — reuses F12 WhatsApp infra |

**Notable deliberate omissions**:
- No "feed", "posts", or "follow" functionality. We are not a social network.
- No "messaging" or "inbox" beyond the existing employer-introduction request flow.
- No rebrand or domain change. Product stays `richblok.app`.
- No standalone mobile app. PWA is sufficient (already shipped).

### 4.3 Architecture — reuse map

Every new feature maps onto existing infrastructure:

| New feature | Existing infrastructure reused |
|---|---|
| F17 AI-pair challenge | Challenge engine (F3) + Badge (F4) + Realisation module (existing) |
| F18 Transcript ingestion | `/api/cv-extract` pipeline (F15) |
| F19 AI tags | `COMPETENCY_TAGS` array in `Challenge.ts` + STAR mapper (F9) |
| F20 Badge metadata | Firestore `badges` schema — nullable `ai_tool_used` field |
| F21 Vendor sponsorship | Stripe one-off checkout (F14) |
| F22 Employer filter | `employer-dashboard.component.ts` existing filter pipeline |
| F23 Discovery page | New lazy route (Angular 17 standalone), reads from Firestore |
| F24 Weekly leaderboard | WhatsApp Business API delivery worker (F12) |

Net-new infrastructure needed: **zero**. Everything is additive to shipped code.

---

## 5. Success metrics

### 5.1 North Star (carried from v3, re-scoped)

"Verified AI-pair stories generated this week"

This now counts both:
- Classic STAR stories generated from challenge completion (existing)
- AI-pair stories generated from F17 challenges + F18 transcript uploads (new)

**Target by Day 90 (from v4 launch)**: 2,500/week. This is ambitious; justify
if we fall short by 50% and stay the course if we're within 30%.

### 5.2 Leading indicators to watch weekly

| Metric | Day 30 target | Day 60 | Day 90 |
|---|---|---|---|
| F17 AI-pair challenge completions | 100 | 500 | 2,000 |
| F18 transcript uploads | 50 | 300 | 1,500 |
| Employers using F22 "AI-native" filter | 5 | 20 | 60 |
| F21 vendor-sponsored challenges live | 1 | 3 | 6 |
| F23 discovery page organic traffic | 500/mo | 3,000/mo | 15,000/mo |
| Paid Pro conversions attributable to AI-pair flow | 20 | 100 | 400 |

### 5.3 Quality gates (things that must be true for v4 to be called a success)

1. **No regression on v3 metrics.** CV-first onboarding funnel still converts,
   African talent focus still delivers employer intros.
2. **Verification discipline is measurable.** Candidates who score high on
   `verification_discipline` in F17 challenges must correlate with positive
   employer hire outcomes by Day 180. If not, we cut the feature.
3. **Sponsored-challenge flywheel actually spins.** At least 3 distinct AI
   vendors sponsor at least one challenge by Day 90. If zero after two months
   of outreach, we accept this is not a revenue stream and pivot it to
   "free vendor co-marketing."
4. **African-distribution advantage is maintained.** At least 60% of F17
   challenge completions come from African ccTLD / IP ranges. If we drift
   below 40%, we've lost our positioning and are just another credential
   platform.

---

## 6. 90-day implementation plan

### Weeks 1-3 (Sprint 1): P0 features
- F19 data-model extension (half day)
- F18 transcript ingestion (2 days)
- F17 AI-pair challenge format, first variant (4-5 days)
- Seed content: 3 AI-pair challenge templates (Node, Python, React) authored
  by the team — not generated. These must be real problems with known-good
  solutions. (3 days)
- Ship to production, run first public AI-pair challenge on HN / r/MachineLearning.

### Weeks 4-6 (Sprint 2): P1 features + sponsor outreach
- F20 badge metadata + OG rendering updates
- F22 employer dashboard "verified AI-native" filter
- F21 sponsored-challenge flow (extends F14)
- Outreach: email 20 AI-tool vendor developer-marketing teams. Target: 3
  paid pilots by Day 42.

### Weeks 7-10 (Sprint 3): P2 features + scale plays
- F23 discovery page with SEO targeting
- F24 leaderboard + WhatsApp growth loop
- Second AI-pair challenge batch (harder problems, employer-submitted briefs)
- Case-study content: 3 written profiles of early F17 badge-earners who got
  hired as a result. Distribute on LinkedIn, HN, African dev communities.

### Weeks 11-13: optimization
- Whatever the data says. If `verification_discipline` predicts hire outcome,
  promote it. If F21 sponsorship doesn't close, reframe. If F23 page does
  better than expected, invest in it.

---

## 7. Pricing model changes

### 7.1 Unchanged from v3
- Consumer: $10/mo Pro ($7 annual) — F17 challenges count against the existing
  monthly allotment for free users; Pro is unlimited.
- Employer Starter: $500/yr (50 profile views/mo)
- Employer Pro: $1,500/yr (unlimited)
- University licenses: $3,000-$10,000/yr

### 7.2 New in v4
- **AI-vendor sponsored challenge**: $2,000-$5,000/challenge (up from $500-$2,000
  of F14). Higher ceiling because vendor sponsorships carry their own branding
  and we host the tool-specific tutorial content.
- **Employer "AI-native access" add-on**: +$500/yr on top of Starter or Pro
  license. Unlocks F22 filter and tool-breakdown analytics.

### 7.3 Target revenue mix at Day 180

| Source | MRR contribution | % of total |
|---|---|---|
| Consumer Pro (existing + AI-pair upsell) | $3,000 | 20% |
| Employer licenses (existing base) | $5,000 | 33% |
| Employer AI-native add-on (new) | $1,000 | 7% |
| Sponsored challenges (annualized, existing) | $2,500 | 17% |
| Sponsored AI-pair challenges (new, vendor) | $2,500 | 17% |
| University pilots (existing) | $1,000 | 6% |
| **Total** | **$15,000** | **100%** |

Base case: $15K MRR by Day 180 post-v4-launch. Stretch to $20K if F21 vendor
flywheel works. Failure threshold: if we're below $10K by Day 180, v4 is not
validated and we retrench to v3 scope.

---

## 8. Risks and mitigations

### 8.1 Risks we ACCEPT (because the upside is worth it)
- **Short-term distraction from PRD v3 flows.** Mitigated by: all v4 features
  are additive, nothing in v3 is removed.
- **Transcript-ingestion privacy concerns.** Mitigated by: transcripts are
  processed and discarded exactly like CV PDFs today (F15). Same privacy copy.
- **AI-vendor sponsorship slower than projected.** Mitigated by: vendor
  sponsorship is a nice-to-have, not load-bearing. We can hit $10K MRR
  without it (existing employer + consumer + university streams suffice).

### 8.2 Risks we MITIGATE
- **LinkedIn or another incumbent copies the feature.** Mitigation: build the
  data network effect. The more AI-pair challenges we score, the more
  calibrated our percentile data is. Late-comers can't catch up on that.
- **AI tool market consolidates to one winner (e.g. Anthropic or OpenAI).**
  Mitigation: stay tool-agnostic in branding and challenge design. If one
  tool wins, our sponsorship revenue concentrates but we still ship the
  credential, which is the product.
- **Challenge authorship doesn't scale.** Mitigation: crowdsource from employer
  briefs (F14/F21) and accept human curation as a bottleneck for now. Automate
  generation only once we have 50+ hand-authored challenges as calibration set.

### 8.3 Risks we REJECT (explicit "we are not going to do that")
- **Rename to "Claude Network" / vendor-anchored brand.** Rejected for reasons
  detailed in strategic analysis: trademark, vendor risk, brand-eating-brand,
  narrower TAM. Richblok stays Richblok.
- **Pivot to "AI developer network" / social feed / content platform.**
  Rejected: every developer social network since 2008 failed; GitHub and
  Stack Overflow are the durable winners and they're not networks, they're
  work-product hosts; our product is credentials not conversations.
- **Launch without African-distribution validation.** Rejected: the African
  supply wedge is the thing. If it's not delivering F17 completions from
  African IPs, we have lost the wedge, not gained a new one.

---

## 9. Open questions — to resolve before Sprint 1

1. **Authorship of the first 3 AI-pair challenges.** Who writes them? These
   must be real bugs in real-ish code. Recommendation: pair the founder with
   one senior African dev from the existing Richblok network to co-author.
2. **Transcript privacy copy.** Legal language on the onboarding page needs
   to cover "we will analyze transcripts for scoring; bytes discarded after
   processing; we do not retain or share." Not legal advice; needs a real
   reading.
3. **First vendor to approach for F21.** Anthropic is obvious but competitive;
   their dev-marketing budget is already contested. Cursor is maybe higher-EV
   per-dollar because they need African-dev distribution more. Replit is a
   dark horse. Recommendation: pitch all three in the same week; go with
   first to sign.
4. **LinkedIn response.** If LinkedIn ships something in-range within 60 days
   of v4 launch, we need a defensive answer. Decide now: do we double down on
   the African wedge, or do we pivot to white-labeling our verification to
   job boards (b-side business)? No need to pick today but have the framework.
5. **Scoring of `verification_discipline`.** This is the most valuable new
   signal and the hardest to automate. First-version scoring is LLM-judged
   from the transcript: did the candidate catch hallucinations, fact-check
   AI output, push back on bad suggestions? Needs careful prompt design and
   a calibration set before launch.

---

## 10. What "done" looks like at Day 90

- F17, F18, F19, F20, F21, F22 shipped to production, instrumented, analytics
  firing
- 2,000+ AI-pair challenges completed, of which ≥1,200 by African IP ranges
- 3+ AI vendors running sponsored challenges
- 60+ employers using F22 "AI-native" filter in their active searches
- $15K MRR run-rate with the breakdown in §7.3
- Written case studies of 3 African developers hired into NA/EU remote roles
  as direct result of their Richblok AI-native badge
- One public quote from a hiring manager of the form: "I hired X because their
  Richblok AI-pair score told me they could actually ship with the tools I
  use." This is the marketing unlock. Chase it.

---

## Appendix A — Competitive positioning matrix (updated for AI era)

| Capability | LinkedIn | Forage | Parker Dewey | Big Interview | Coursera | **Richblok v4** |
|---|---|---|---|---|---|---|
| Real project work with scored outcome | No | Yes | Yes | No | Partial | **Yes (core)** |
| **Verified AI-tool competency** | **No** | **No** | **No** | **No** | **No** | **Yes (only platform)** |
| **AI transcript as credential input** | **No** | **No** | **No** | **No** | **No** | **Yes (only platform)** |
| STAR behavioral mapping | No | No | No | Partial | No | Yes (deep) |
| Tool-agnostic AI credential | — | — | — | — | — | **Yes** |
| African-talent distribution | No | No | No | No | No | **Yes** |
| Affordable employer marketplace | No (expensive) | Partial | No | No | No | **Yes** |
| WhatsApp-native community | No | No | No | No | No | Yes |

Three capabilities are **unique to Richblok v4** and together form the
defensible position. Any competitor copying one would need all three to win.

---

*End PRD v4.*
*Co-authored by the Richblok founding team and Claude (Anthropic).*
