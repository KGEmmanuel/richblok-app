# Richblok PRD v5 — AI-Native Verified Talent + Premium Brand System

**Version**: 5.0 · supersedes v4
**Date**: April 2026
**Scope**: Carries the full AI-native product thesis from v4, adds a complete
brand system and UI/UX overhaul, defines the asset migration plan to kill
~400 KB of legacy dependency and ~220 legacy images, and gives the 33
Bootstrap-era pages a path to the Linear/Vercel-quality design language that
the 12 v3/v4 pages already use.

**One-line thesis**: The product side is ready. The surface doesn't match.
Until a user who lands on the mint-dark landing page no longer gets dropped
into a 2019 Osahan admin template on login, we are leaking trust. V5 closes
that gap.

---

## 0. How v5 relates to v4

v5 is **v4 + brand + UI/UX**. The 8 new features from v4 (F17-F24) are
unchanged. The product thesis, user personas, market analysis, pricing,
and risks carry over untouched. This document **supersedes** v4 because a
premium credentialing product cannot live inside a template-store UI — the
UI/UX is the credential's frame. If the frame looks cheap, the credential
is perceived as cheap. V5 makes that non-negotiable.

The v4 product content is summarized at Part I below; full detail is still
in `RICHBLOK_PRD_V4_AI_NATIVE.md`. V5 adds Parts II-V.

---

## Part I — Product thesis (from v4, in brief)

**What we sell**: a verified AI-native skill credential. The only platform
that issues a scored badge of the form "this human, in a timed setting, with
any AI tool of their choice, produced this artifact worth X/100 by automated
review + optional human re-check."

**Who buys**:
- **Candidates** (primary: African tech talent earning the badge, free
  tier + $10/mo Pro). They use Richblok to make their AI-native productivity
  legible to global employers.
- **Employers** (primary: NA/EU remote-hiring teams). They pay $500-$1,500/yr
  to filter the global candidate pool by verified AI-native signals.
- **AI-tool vendors** (Anthropic, Cursor, Cognition, Replit). They pay
  $2,000-$5,000 per sponsored challenge to put their branding on top
  performers and build awareness inside the African developer market.
- **Universities** (pilot via African institutions). $3K-$10K/yr license
  for cohort tracking and outcome reporting.

**What ships in v4 (code-complete, waiting for content + env vars)**:
F17 AI-pair challenge, F18 transcript ingestion, F19 AI-competency tags,
F20 tool-agnostic badge metadata, F21 vendor-sponsored challenges, F22
employer "verified AI-native" filter, F23 `/ai-native` discovery page,
F24 weekly leaderboard + WhatsApp broadcast.

**What v5 adds on top**: the complete visual/experiential overhaul that makes
all of the above feel premium instead of template-assembled.

---

## Part II — Brand audit & definition

### 2.1 Current state (honest)

The Richblok codebase has two entirely different visual identities running
in parallel. Users bounce between them depending on route.

#### 2.1.1 Premium language (shipped in v3 + refined in v4)

12 routes / components use this:
- `/landing`, `/onboard`, `/star/:id`, `/coach/:id`, `/badge/:id`, `/sponsor`
- `/employer/dashboard`, `/university/dashboard`
- `/admin`, `/admin/challenges`, `/admin/seed-challenges`
- `referral-widget` shared component

Design language:
- Near-black background (#0A0A0A / #111113)
- Mint accent (#1DD1A1), cyan secondary (#22D3EE)
- Inter Variable (body + display), JetBrains Mono (tabular-numeric + code)
- 4px base grid, 8px major, generous whitespace
- Sharp type, minimal chrome, Linear/Vercel-style discipline
- Inline SVG iconography, no rasters

Verdict: **95% of the way to premium.** Minor inconsistencies (two slightly
different mint greens shipped; one page uses a variant of the dark bg; OG
image template is ad-hoc) but this is what we scale to 100% of routes.

#### 2.1.2 Legacy language (Osahan Bootstrap template, circa 2019)

33 routes / components use this:
- `/feed`, `/record`, `/jobs`, `/evaluate` (the four primary logged-in surfaces)
- `/demonstrate`, `/cv`, `/profile`, `/friends`, `/messages`, `/notifications`
- `/search`, `/settings`, `/organisation/:id`, `/create-organisation`
- `/job-profile/:id`, `/post-jobs`, `/post-job-step-[1-5]`, `/job-process/:id`
- `/participate-to-challenge/:id`, `/create-challenge`, `/demo/:type/:id`
- All `record-*` sub-pages (skills, experiences, languages, documents,
  realisation, pro-train, acc-train)
- All `feed/post/*` sub-components

Design language:
- Teal primary (#047B80) — legacy from old Osahan template
- Bootstrap 4.0 grid (`container`, `row`, `col-xl-*`)
- Osahan-specific CSS classes (`osahan-post`, `osahan-nav-top`, `osahan-*`)
- Generic `Open Sans` + `Arial` fallback (no Inter)
- 221 raster images bundled (82 JPG + 109 PNG + 27 SVG + 3 GIF)
- White cards with `shadow-sm border rounded bg-white` on dark-navy bg
- Font Awesome 4.3.0 (via maxcdn)
- jQuery 3.2.1 slim + jQuery 3.3.1 full + Popper.js 1.12.9 + Bootstrap 4 JS
  all loaded **on every page** via `src/index.html`

Verdict: **This is the frame the user lands in 3 seconds after login.** It
is the thing every AI-native employer and Pro-tier candidate pays to use and
every WhatsApp pod member sees. It is currently inconsistent with the
marketing surface by a margin so wide that a user would reasonably wonder
if they clicked a phishing link.

### 2.2 The dissonance, concretely

**Path a Nigerian mid-level dev takes today:**

1. Sees a WhatsApp share of a Richblok badge → lands on `/badge/abc123`.
   Premium mint-dark badge card, "Verified · Top 27% of mid-level candidates
   in Africa." Impressed. Clicks through.
2. Lands on `/landing`. Premium hero, CV-first CTA. Signs up via
   Google OAuth.
3. Redirected to `/feed`. Lands in what looks like a **different website
   from 2019**: teal Bootstrap navbar, white cards on navy bg, stock avatar
   placeholders, Font Awesome icons, search box with rounded input and
   `btn-outline-primary`. Jarring. Clicks around looking for the landing
   page's polish. Can't find it.
4. Goes to `/record` to build their profile. More of the same. Closes tab.

**What a Canadian hiring manager sees today:**

1. Employer introduction email with badge link → `/badge/abc123`. Premium.
2. Clicks "View candidate profile" → `/profile/:uid`. Bootstrap Osahan
   template, 2019-era.
3. Mental math: "This platform is serious on the outside but looks
   internally unfinished. Safer to default to LinkedIn."

Both users experience the dissonance immediately. It costs real funnel.

### 2.3 Brand name decision — keep "Richblok"

Previous session's strategic analysis covered this in detail. Summary:
- Richblok stays the product name. Domain stays `richblok.app`.
- Wordmark is refined (see 2.5).
- **No** rename to "Claude Network", "AI Native", "Verified", or any
  vendor-anchored brand.
- The brand narrows to a single meaning: **"the verified credential
  employers trust."** Every surface reinforces that.

### 2.4 Brand voice & tone

Three words the brand is:
- **Verified** — every claim comes with a scored proof. Neither "maybe"
  nor "I think." We say the number, we cite the artifact.
- **Precise** — monospace where numbers live. Tabular columns. No vague
  superlatives. "87/100" not "high-scoring."
- **Confident** — African tech talent shipping to global standards, not
  asking for charity consideration. We are not a bootcamp, we are not a
  non-profit. We are a market-maker.

Three words the brand is **not**:
- Not **friendly** — we are warm but we are not your buddy. We are the
  professional credential on your LinkedIn header.
- Not **playful** — no emoji in product chrome, no Comic Sans, no
  exclamation marks in CTAs. Badge rendering, coach output, and OG images
  treat the user as an adult professional.
- Not **vendor-affiliated** — we never pretend to be Anthropic, Cursor,
  or any AI tool. We evaluate output from all of them and our wordmark
  appears independently.

Voice examples:

| Context | Wrong (current in some places) | Right (v5 tone) |
|---|---|---|
| Empty state | "Oops! No challenges yet 😢" | "No completed challenges yet. Take one to generate your first STAR story." |
| Error | "Something went wrong!" | "Coach unavailable. Your draft is saved locally. Retry in 30 seconds." |
| Success | "🎉 You earned a badge!!!" | "Verified · React Mid Level · Score 87/100 · Top 27% of candidates" |
| CTA | "Start your journey 🚀" | "Start free challenge" |
| Pricing | "Go Pro!" | "Pro — $10 / month. Unlimited challenges, priority recruiter visibility." |

### 2.5 Wordmark & logomark

**Current state**: the product ships `/assets/img/log.png` (a raster,
uncertain provenance, rendered across 33 legacy pages at max-height 100px)
plus `/assets/img/logo.jpg`, `/assets/img/logo.png`, `/assets/img/logo.svg`,
`/assets/img/logo_dark.jpg`, `/assets/imgs/logo.png` — **6 different "logos"
shipped simultaneously**, each slightly different. This must collapse to one.

**V5 logo system**:

1. **Wordmark**: `richblok` — all lowercase, Inter Variable @ weight 900,
   letter-spacing -0.04em. No capital R. The shift to lowercase is deliberate —
   it signals "verified" rather than "corporate." Rendered inline as text
   (no raster logo on most pages) with the mark beside it.

2. **Mark**: a rounded square (12px radius) 32px × 32px, gradient fill from
   `#1DD1A1` at top-left to `#22D3EE` at bottom-right, containing a bold
   lowercase `r` in weight 900 at `color: #0A0A0A`. This is the current
   mark in use on `/landing` and the premium pages — **adopt it as the
   single mark across all surfaces**.

3. **Favicon**: the mark rendered at 32×32 and 48×48 PNGs, plus a 180×180
   apple-touch-icon. Current `/src/favicon.ico` is a different old logo and
   must be regenerated.

4. **Social OG image**: 1200×630 SVG generated server-side by `/og/badge/:id`
   (already shipped) — extends to a generic `/og/default` for
   non-badge pages that currently serve `/assets/rb/og-default.svg`. Both
   already exist; we just standardize on them.

5. **Never**: photos inside the wordmark, gradients inside the `r`, outlined
   variants, emoji mascots, or "stamp" / "badge" overlays on the mark.

### 2.6 Color system (refined)

| Role | Token | Hex | Usage |
|---|---|---|---|
| **Brand** | `--rb-accent` | `#1DD1A1` | Primary mint. CTAs, verified chips, active filter, progress fills |
| **Brand-2** | `--rb-accent-2` | `#22D3EE` | Accent cyan. Logo gradient, hover states, secondary links |
| **Background** | `--rb-bg` | `#0A0A0B` | Page background (near-black, subtle warm bias) |
| **Surface** | `--rb-surface` | `#111114` | Card backgrounds, nav bars |
| **Surface-high** | `--rb-surface-hi` | `#18181C` | Hovered card, elevated panel |
| **Border** | `--rb-border` | `#27272A` | Hairlines, input borders, divider |
| **Border-high** | `--rb-border-hi` | `#3F3F46` | Focus ring, emphasized divider |
| **Text** | `--rb-text` | `#FAFAFA` | Primary text, headings |
| **Text-muted** | `--rb-text-muted` | `#A1A1AA` | Secondary text, descriptions |
| **Text-dim** | `--rb-text-dim` | `#71717A` | Metadata, captions |
| **Warning** | `--rb-warning` | `#FACC15` | Draft chips, alerts, pilot-preview banners |
| **Danger** | `--rb-danger` | `#EF4444` | Errors, destructive actions, required-field markers |
| **Success-dim** | `--rb-accent-15` | `rgba(29,209,161,0.15)` | Chip backgrounds |

**Colors to REMOVE from the codebase**:
- `#047B80` (legacy teal — 1 usage in Osahan CSS, purge)
- `#6610F2` (legacy purple — in shipped Bootstrap CSS, will die with Bootstrap)
- Any hard-coded `white` / `#FFF` on cards in logged-in surfaces — replace
  with `--rb-surface`.
- `bg-white`, `bg-dark`, `bg-navy` Bootstrap utility classes — replace with
  tokenized SCSS variables.

### 2.7 Typography

| Role | Font | Weight | Size/Scale | Use |
|---|---|---|---|---|
| Display XL | Inter Variable | 900 | 56-72px | Landing hero only |
| Display L | Inter Variable | 800 | 40-48px | Page H1 |
| Display M | Inter Variable | 800 | 32px | Section H2 |
| Heading | Inter Variable | 700 | 20-24px | Card titles, H3 |
| Body | Inter Variable | 400-500 | 15-16px | Paragraphs, labels |
| Small | Inter Variable | 500 | 13px | Metadata, captions |
| Eyebrow | JetBrains Mono | 600 | 12px | Section kickers (STEP 1 OF 3) |
| Numeric | JetBrains Mono | 700 | 16-48px | Scores, counters (tabular-nums) |
| Code | JetBrains Mono | 500 | 13px | `<code>` blocks, env vars, IDs |

**Rules**:
- Letter-spacing tightens as size grows: -0.01em at 16px, -0.03em at 48px,
  -0.04em at 72px.
- Line-height 1.15 for display, 1.35 for headings, 1.6 for body, 1.5 for
  small.
- Never more than 3 weights on a single page.
- Numeric eyebrows, scores, percentiles, and any metric always use JetBrains
  Mono with `font-variant-numeric: tabular-nums`.

**Fonts to REMOVE**:
- `Open Sans` (loaded via `/assets/cv/css/style.css` for CV template, unused)
- `Roboto` `Ubuntu` `Montserrat` `Helvetica` `Arial` fallbacks in Osahan CSS
- Font Awesome 4.3.0 (replaced with Lucide — see 2.8)
- Feather icons font (replaced with Lucide)

### 2.8 Iconography

**Current state**: Font Awesome 4.3.0 (via maxcdn) + Feather icons webfont
(bundled, 90KB) + inline SVG + inline emoji, all mixed. A single page might
use three icon systems simultaneously.

**V5 decision**: **Lucide icons** as the single system. Chosen because:
- Open-source fork of Feather (family resemblance, no style break)
- 1,400+ icons, tree-shakeable, SVG-based
- `lucide-angular` package integrates with Angular 17 standalone components
- Visual consistency with Vercel, Linear, shadcn/ui ecosystems (which is the
  aesthetic lane we already occupy)

**Implementation**:
- Install `lucide-angular`, import `LucideAngularModule` (or individual icon
  providers for tree-shaking) in the standalone components that use icons.
- Replace all `<i class="feather-*">`, `<i class="fa fa-*">`, and emoji icons
  with `<lucide-icon [img]="ChevronRight" />` form.
- Stroke width 2.0 for body, 2.5 for CTAs, 1.5 for large decorative.
- Color inherits from text-color; accent color only when icon is the primary
  action indicator.

**Emoji usage**: reserved for user-generated content only (WhatsApp shares,
chat messages, coach replies). **Never** in product chrome, CTAs, empty
states, errors, or buttons. The six places that currently use emoji as icons
(`🎉`, `✨`, `🎯`, `📋`, `🤖`, `👥` in STAR profile & coach) get replaced with
Lucide equivalents: `party-popper`, `sparkles`, `target`, `clipboard-copy`,
`bot`, `users`.

### 2.9 Motion

**Principles**:
- **Present but restrained.** Angular animations fire on route change and
  state transition, not on page scroll.
- **Timing**: 150ms for micro (hover, focus), 250ms for macro (modal open,
  page enter), 400ms for celebration (badge earned).
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` ("ease-out-expo") for
  entrances, `cubic-bezier(0.64, 0, 0.78, 0)` ("ease-in-quart") for exits.
- **Reduced-motion**: respect `prefers-reduced-motion`. All celebration
  animations collapse to instant state-change for those users.

**Component-level motion rules**:
| Component | Motion |
|---|---|
| Button hover | 150ms scale(1.02) + shadow elevation |
| Card hover | 150ms border-color change only, no lift |
| Modal open | 250ms opacity 0→1 + translateY(12px → 0) |
| Toast | 250ms slide from top + 200ms fade-out at 4s |
| Route enter | 250ms fade + 8px upward slide, content skeleton first |
| Badge earned | 400ms scale bounce (0.8 → 1.2 → 1) on the number |
| Streaming text (AI coach) | 50-120ms delta flush, char-by-char from SSE |
| Skeleton shimmer | 1.5s loop, gradient sweep across placeholder |

**Never**:
- Bounce on anything except the first time badge earn (psychological moment)
- Parallax scroll
- Auto-rotating carousels
- Scroll-triggered animations on the marketing site (they distract)

### 2.10 Imagery

**V5 rule**: **no photographic raster images in product chrome.** We use:
1. **SVG illustrations** — custom, minimal, monochromatic-plus-accent. Feel
   like Stripe's illustration system (line art, single color + one accent).
2. **Abstract patterns** — subtle dot grids, gradient meshes, noise overlays.
   Used as hero backgrounds only.
3. **User-uploaded content** — avatars, CV extracts, logos. Always
   frame-cropped and treated (circular clip + 1px border + 12px radius).

Where we use stock/illustration today and what replaces it:

| Current asset | Used where | V5 replacement |
|---|---|---|
| `/assets/img/l1.png` - `l8.png` (8 Osahan loading/template images) | Old loading screens | Delete. Use `<app-loading-spinner>` with CSS-animated skeletons. |
| `/assets/img/p1.png` - `p13.png` (13 Osahan profile pics) | Stock avatars in old cards | Delete. Use initials-badge generated SVG. |
| `/assets/img/user-14.jpg`, `user.png` | Generic avatar fallbacks | `/assets/rb/avatar-default.svg` (already shipped) |
| `/assets/img/post1.png` | Post card placeholder | Delete; post cards show uploaded content or skip image |
| `/assets/img/premium.png` | "Go Pro" CTA image | Delete; CTA is typographic |
| `/assets/img/Chat.png`, `add.png`, `chart.png`, `ads1.png` | Feature icons in Osahan | Replaced by Lucide inline SVG |
| `/assets/img/e1.png`, `e2.png` | Old experience icons | Delete; icons are Lucide |
| `/assets/img/fav.png` | Legacy favicon | Replace with v5 wordmark favicon |
| `/assets/img/rtl.png` | Right-to-left layout placeholder | Delete (we don't support RTL yet) |
| `/assets/img/dark.png`, `light.png` | Theme preview images | Delete (no light theme in v5) |
| `/assets/imgs/404.jpg`, `404.png` | Old 404 page | Replace with typographic /404 (already standalone in v4) |
| `/assets/imgs/RichCoin.svg`, `RichCoin-outline.svg` | Deprecated crypto feature | Delete |
| `/assets/imgs/mtn.jpg`, `orange.jpg`, `camtel.jpg`, `logo-IAI-Cameroun-good.png`, `campost.jpg` | Legacy African partner logos | Move to a `partners/` directory referenced only in the (future) trust-bar. If not used by July 2026, delete. |
| `/assets/imgs/fb.png` | Facebook icon | Replaced by Lucide `facebook` |
| `/assets/imgs/demons.png`, `feed.png`, `feed2.png`, `friends.png`, `jobs.png`, `lang.png`, `langauges.png`, `skills.png`, `skillp.png`, `skillr.png`, `skillss.png`, `real.png`, `realisations.png`, `exps.png`, `expss.png`, `exp.png`, `experiences.png`, `train.jpg` | Generic Osahan feature icons | All deleted. Routes that render them switch to typographic or Lucide icons. |
| `/assets/imgs/c.jpg`, `c.psd`, `Sans titre-1.psd`, `Sans titre 1.psd` | PSD source files | Delete; these should never have been committed. |
| `/assets/cv/*` | Full 2017-era resume template assets | Audit whether `/cv` page still uses them. If yes, keep but do not extend. If no, delete. |
| `/assets/landing/*` | Landing template assets | Audit whether referenced after v4 landing rewrite. Likely delete. |
| `/assets/images/*` | Even-older stock images (blog1-5.jpg, bb3.jpg) | Delete all except PWA icons (apple-icon-*). |

**Total asset purge target**: reduce from 221 images to <30. The 30 that
stay: `/src/favicon.ico` (regenerated), 8 PWA icons, 8 `/assets/rb/*` SVGs,
~10 Lucide icon inlines (ship as inline SVG in Angular templates rather
than `/assets`), 5 partner logos (if trust bar ships).

### 2.11 Legacy JS/CSS to purge

`src/index.html` currently loads the following at every page load:

```html
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.js"></script>
<script src="./assets/js/jquery.easypiechart.js"></script>
<script src="https://unpkg.com/peerjs@1.0.0/dist/peerjs.min.js"></script>
<script src="./assets/js/range.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
```

**Size**: roughly 430 KB of JS + 70 KB of Font Awesome CSS, loaded for every
route. About 5% of what it does is still in active use (Bootstrap grid +
dropdown chrome on the 33 legacy pages). 95% is dead weight.

**Purge timeline**:
1. **Phase A (v5 sprint 1 — same as UI migration below)**: remove jQuery slim
   (only one jQuery needed), remove peerjs (no usage in any v4/v5 flow),
   remove jquery.easypiechart.js (replaced by `ng-circle-progress` already
   installed), remove range.js (no usage found). Savings: ~200 KB.
2. **Phase B (v5 sprint 2)**: once 15+ legacy pages are migrated to the
   premium language, drop Font Awesome CDN (replaced by Lucide). Savings:
   ~70 KB.
3. **Phase C (v5 sprint 3)**: once all 33 legacy pages migrated, drop
   Bootstrap CSS + JS + Popper. Savings: ~150 KB.
4. **Final state**: `src/index.html` has no third-party `<script>` tags
   beyond the Angular bundle itself. Marketing-surface polyfills for older
   mobile browsers retained. Font Awesome and Bootstrap are gone.

---

## Part III — UI/UX requirements

### 3.1 Component system

V5 ships a canonical component library in `src/app/shared/ui/` (new
directory). Every legacy page migrates to use it. Each component is standalone
(Angular 17), accepts tokenized inputs, emits typed events.

**Atoms**:
- `<rb-button>` — 4 variants (primary, ghost, link, danger), 3 sizes (sm, md,
  lg), loading + disabled states. Replaces every `btn btn-*` usage.
- `<rb-input>` — text, email, password, number, textarea. Floating label
  variant available. Replaces every raw `<input class="form-control">`.
- `<rb-select>` — native-styled dropdown, supports search for >10 options.
- `<rb-checkbox>`, `<rb-radio>`, `<rb-toggle>` — semantic form controls.
- `<rb-chip>` — verified / draft / tag / competency variants.
- `<rb-avatar>` — user avatar with initials fallback, size sm/md/lg.
- `<rb-icon>` — Lucide SVG wrapper, typed name enum.
- `<rb-spinner>` — single loading spinner replaces `<app-loading-spinner>`,
  `loading.gif`, `ajax-loader.gif`, etc.

**Molecules**:
- `<rb-card>` — base card (surface bg + border-radius 14 + padding 24), with
  optional header + footer slots.
- `<rb-stat>` — big number + label (used on dashboards). Tabular-nums by
  default.
- `<rb-filter-chip-row>` — horizontal filter bar; behavior already
  implemented in `/evaluate` and `/employer/dashboard`, extracts to shared.
- `<rb-empty-state>` — icon + heading + sub + optional CTA.
- `<rb-toast>` — replaces ngx-toastr styling; keeps the library, restyles.
- `<rb-modal>` — replaces `<app-upgrade-modal>` patterns; standardized open
  animation, backdrop, keyboard dismiss.
- `<rb-progress>` — linear + circular (circular wraps `ng-circle-progress`).

**Organisms**:
- `<rb-app-shell>` — the logged-in nav shell (replaces legacy `<app-header>`
  + `<app-footer>` wrapper). Sticky top nav, inline search, avatar
  dropdown, notifications bell. Sidebar on desktop ≥1024px.
- `<rb-public-shell>` — the logged-out nav for marketing pages. Already
  partially exists in `LandingComponent`; extract.
- `<rb-badge-card>` — the canonical badge display (already in use on
  `/badge/:id`, extract).
- `<rb-candidate-card>` — employer dashboard candidate tile (extract).
- `<rb-challenge-card>` — evaluate catalog tile (extract).

### 3.2 Page-by-page migration priority

Not every legacy page matters equally. The 33 legacy pages sort into tiers:

**Tier 1: load-bearing surfaces (migrate first)**
| Page | Why it matters | Migration effort |
|---|---|---|
| `/feed` | First screen after login; sets impression of the whole product | L (3 days) |
| `/record` | Where users build their profile; required for STAR credibility | L (3 days) |
| `/evaluate` | Challenge catalog; the supply side of the marketplace | M (1-2 days) |
| `/jobs` | Employer-visible candidate surface | M (2 days) |
| `/profile` / `/profile/:id` | The public face of every Richblok user | M (2 days) |
| `/participate-to-challenge/:id` | Where the actual challenge happens — the critical 20 minutes | L (2-3 days) |
| App shell (`<app-header>` + `<app-footer>` navigation) | Every legacy page depends on this | M (1 day) |

Tier 1 total: ~14-18 engineering days. This is the spike that unifies the
experience. After tier 1 ships, 90% of the user journey is on the premium
surface.

**Tier 2: supporting but not daily-traffic**
| Page | Effort |
|---|---|
| `/settings`, `/friends`, `/notifications`, `/messages`, `/cv` | 2-3 days each, total ~10 days |
| `/search` | S (1 day) |
| `/demonstrate` + subtree | M (2 days) |
| `/organisation/:id`, `/create-organisation`, `/organisation-settings` | ~3 days |

**Tier 3: rarely-used / candidate for deprecation**
| Page | Action |
|---|---|
| `/post-job-step-[1-5]` (5-step job posting wizard) | Audit: is anyone using this? If not, delete. If yes, merge to a single page. |
| `/job-profile/:id`, `/job-process/:id` | Consolidate into `/profile/:id` with tabs |
| `/record/record-acc-train` (academic training separate from pro) | Merge with pro-train as one "training" tab |
| `/demo/:type/:id` | Deprecated pre-v3 feature. Remove route + component. |
| `/upload` (UploadFileComponent) | Is this still wired? Audit. Likely delete. |

### 3.3 Logged-in app shell redesign

Current `<app-header>` (legacy) has:
- Dark navy navbar with teal accent
- Search box inline in navbar (centered, prominent)
- Nav icons: Home, Records, Demonstrate, Evaluate, Jobs, Connection
- RichCoin counter, 2 notification bells (chat + general), avatar dropdown

Current `<app-footer>` (legacy) has:
- Fixed bottom bar on mobile (duplicating top nav)

**V5 app shell**:

Desktop (≥1024px):
```
┌─────────────────────────────────────────────────────────────┐
│ [r] richblok    Search candidates, skills, challenges…  🔔 👤 │
├─────────────────────────────────────────────────────────────┤
│  📊 Feed                                                      │
│  🎯 Challenges         [Main content area]                    │
│  💼 Jobs                                                       │
│  📝 My profile                                                 │
│  👥 Network                                                    │
│                                                                │
│  ─────                                                         │
│  ⚙ Settings                                                    │
└─────────────────────────────────────────────────────────────┘
```
- Left rail: 240px fixed sidebar, 6 nav items + divider + settings
- Top bar: 56px sticky, contains logo, inline search (500px centered),
  notification bell, avatar
- Main content area: max-width 1200px with generous gutter
- No duplicate mobile nav bar; sidebar becomes a drawer on <1024px

Mobile (<1024px):
```
┌──────────────────────────┐
│ [☰] [r] richblok     🔔 👤 │
├──────────────────────────┤
│                           │
│  [Main content area]      │
│                           │
├──────────────────────────┤
│  📊  🎯  💼  📝  👥       │
└──────────────────────────┘
```
- Top: 48px bar with hamburger, logo, notifications, avatar
- Bottom: 56px tab bar with 5 primary nav items (iconic only)
- Content: full-width minus 16px gutter

Replaces `<app-header>` + `<app-footer>` as two new standalone components:
`<rb-app-shell>` (wraps all logged-in pages) and `<rb-public-shell>` (marketing).

### 3.4 Badge & STAR profile canonical design (already shipped — codify)

The `/badge/:id` and `/star/:id` pages shipped in v3 are the visual
reference for the rest of the product. Their patterns become canonical:

- **Badge card**: 480px max-width, surface background, 16px border radius,
  padding 32px, inner `rb-stat` with score + percentile, verified chip,
  "Verified by Richblok" footer, optional tool-used logo (v4 F20).
- **STAR answer card**: collapsible, chip-row with competency + verified/draft
  status, S/T/A/R labeled rows with JetBrains Mono letter + Inter label,
  suggested-challenges block for draft answers.
- **Hero with celebration**: used on `fromChallenge=1` / `fromCv=1`, scales
  the emoji/icon to 56px, bounces once on mount, sub-copy explains next step.

### 3.5 OG image system (extend)

Current `/og/badge/:id` generates dynamic 1200×630 SVG for WhatsApp/Twitter
crawlers. Extend:

- `/og/star/:id` — STAR profile preview with competency grid
- `/og/challenge/:slug` — challenge preview with duration + score target
- `/og/sponsor/:id` — sponsor-branded challenge preview with their logo

All follow the same template layout: richblok wordmark top-left, headline
text bold (42-56px), numeric accent in JetBrains Mono, verified chip,
gradient background corner (mint→cyan fade at top-right, fading to
transparent).

### 3.6 Accessibility

V5 commitments:
- All interactive elements have visible focus ring (2px outline
  `color-mix(in oklch, var(--rb-accent) 50%, transparent)`).
- Contrast: text vs background ≥ 4.5:1 for body; large text ≥ 3:1.
- All form inputs have associated labels (no placeholder-as-label).
- Landmark regions: `header`, `nav`, `main`, `footer` correctly semantic.
- Keyboard navigation: every CTA, filter, modal, nav item reachable via
  Tab; Escape closes modals and drawers.
- Screen-reader: aria-live on the AI Coach streaming response, aria-label
  on icon-only buttons.
- Color is never the only signal for state (verified/draft also uses icon
  + text chip, not only green/yellow color).

Lighthouse accessibility score target: 95+ on `/landing`, `/onboard`,
`/badge/:id`. Logged-in surfaces: 90+ after tier-1 migration.

---

## Part IV — Asset migration plan

### 4.1 New assets to create (V5 asset delivery checklist)

For the design/brand vendor or in-house designer:

| Asset | Format | Resolution | Notes |
|---|---|---|---|
| `richblok-mark.svg` | SVG | 32×32 viewBox | Rounded square + gradient + bold `r`, current hero implementation is canonical |
| `richblok-wordmark.svg` | SVG | 200×40 viewBox | Mark + "richblok" lowercase Inter 900 |
| `favicon.ico` | ICO | multi-size (16, 24, 32, 48, 64) | From `richblok-mark` |
| `apple-touch-icon.png` | PNG | 180×180 | From `richblok-mark`, solid bg |
| `icon-192.png`, `icon-512.png` | PNG | PWA manifest icons | From mark |
| `og-default.svg` | SVG | 1200×630 | Already exists; refine to include wordmark + brand tagline |
| Hero illustration set | SVG | variable | 4-6 custom illustrations for: empty states, feature callouts, celebration, error. Monochromatic with accent, Stripe-style line art. |
| Pattern / texture | SVG | 200×200 tile | Subtle dot grid for hero backgrounds, mint at 8% opacity |
| Lucide icons | `lucide-angular` | N/A | Install package; no sprite/raster needed |

### 4.2 Assets to delete (purge list)

Paste into a shell for execution:

```bash
# Old Osahan/Bootstrap template leftovers
rm -rf src/assets/img/l[1-8].png
rm -rf src/assets/img/p[0-9]*.png
rm src/assets/img/user-14.jpg src/assets/img/user.png
rm src/assets/img/post1.png src/assets/img/premium.png
rm src/assets/img/Chat.png src/assets/img/add.png
rm src/assets/img/chart.png src/assets/img/ads1.png
rm src/assets/img/e1.png src/assets/img/e2.png
rm src/assets/img/fav.png src/assets/img/rtl.png
rm src/assets/img/dark.png src/assets/img/light.png
rm src/assets/img/loading.png src/assets/img/logo_dark.jpg
# ...plus 30+ more; full list in commit of Phase A

# Deprecated pre-v3 features
rm src/assets/imgs/RichCoin.svg src/assets/imgs/RichCoin-outline.svg
rm src/assets/imgs/404.jpg src/assets/imgs/404.png
rm src/assets/imgs/demons.png src/assets/imgs/feed*.png
rm src/assets/imgs/friends.png src/assets/imgs/jobs.png
rm src/assets/imgs/lang*.png src/assets/imgs/skill*.png
rm src/assets/imgs/real*.png src/assets/imgs/exp*.png
rm src/assets/imgs/train.jpg

# PSD source files that should never have been committed
rm src/assets/img/"Sans titre-1.psd"
rm src/assets/imgs/"Sans titre 1.psd" src/assets/imgs/c.psd

# Legacy resume template (keep only if /cv route still ships it)
# rm -rf src/assets/cv  # decision pending /cv audit

# Legacy landing-template assets (likely unused after v4 landing rewrite)
# rm -rf src/assets/landing  # decision pending grep audit

# Old blog/marketing stock images
rm -rf src/assets/images/blog*.jpg src/assets/images/bb3.jpg
```

**Estimated repo size reduction**: ~12-18 MB after `git filter-branch` or
BFG cleanup of the deleted-but-tracked history (separate exercise —
history rewrite is not required for Phase A).

### 4.3 Global CSS token file

Create `src/app/shared/ui/tokens.scss` with all CSS custom properties from
2.6 above. Every new standalone component imports tokens via:

```scss
@use 'src/app/shared/ui/tokens' as *;
```

Replaces the pattern of re-declaring `$accent: #1dd1a1` in every component
SCSS (currently done in ~12 files with subtle variations).

---

## Part V — Implementation roadmap

### 5.1 Sprint 0 — Design token foundation (1 week)

Deliverable: an Angular 17 UI kit shipped to `src/app/shared/ui/` containing
atoms + molecules from §3.1. All components are standalone, imported
individually, each with a Storybook-like showcase page at `/dev/ui-kit`
(gated behind admin role).

Exit criteria: `<rb-button>`, `<rb-input>`, `<rb-card>`, `<rb-icon>`,
`<rb-avatar>`, `<rb-chip>`, `<rb-stat>` shipped and documented. Lucide
integrated, tokens.scss canonical.

### 5.2 Sprint 1 — App shell + Tier 1 pages (2 weeks)

Week 1:
- `<rb-app-shell>` + `<rb-public-shell>` built and wired
- `/feed` rewritten on top of rb-app-shell, using rb-card for post items
- `/record` rewritten

Week 2:
- `/evaluate` rewritten (most of the work is stripping Bootstrap; filter
  chip row already exists)
- `/jobs` rewritten
- `/profile` and `/profile/:id` rewritten
- `/participate-to-challenge/:id` rewritten

Exit criteria: the 7 Tier-1 surfaces render with zero legacy Bootstrap
classes. Legacy `<app-header>` + `<app-footer>` components deprecated
(but kept in the module until Tier 2 migrates, to avoid breaking non-migrated
pages).

### 5.3 Sprint 2 — Tier 2 pages + asset purge (2 weeks)

Week 1:
- `/settings`, `/friends`, `/notifications`, `/messages` migrated
- Lucide replaces all Font Awesome usage in migrated pages
- jQuery slim + peerjs + range.js removed from index.html
- 60+ legacy images deleted from `/src/assets/img/` and `/src/assets/imgs/`

Week 2:
- `/cv`, `/search`, `/demonstrate` + subtree migrated
- `/organisation/:id` + org sub-pages migrated
- Badge OG image templates extended (/og/star, /og/challenge, /og/sponsor)

Exit criteria: 20+ of 33 legacy pages migrated. `src/assets/img/` and
`src/assets/imgs/` reduced to <30 files combined. Font Awesome CDN link
removed.

### 5.4 Sprint 3 — Tier 3 + Bootstrap kill (1-2 weeks)

- Remaining Tier 3 pages: either migrated or deprecated (see audit in §3.2)
- Bootstrap CSS + JS + Popper removed from index.html
- `<app-header>` + `<app-footer>` components deleted
- `/assets/cv` and `/assets/landing` audited and deleted if unreferenced
- First round of user feedback on the unified experience collected

Exit criteria: zero remaining Bootstrap 4 class references in product
components. Initial bundle size drops by ≥500 KB from migration start.
Lighthouse score ≥90 mobile on Tier 1 pages.

### 5.5 Sprint 4+ — polish & rollout

- Motion refinements across all pages
- Empty states + error states systematized
- Accessibility audit pass
- Designer polish review
- Video walkthrough for the "what changed" announcement

Total estimated effort: **6-8 engineering weeks** of focused work for one
dev with occasional design support. Compresses to ~3 weeks with a full-time
designer paired.

---

## Part VI — Success metrics for the UI/UX overhaul

### 6.1 Observable leading indicators

| Metric | Baseline (pre-v5) | Target (post v5 Sprint 3) |
|---|---|---|
| Initial JS bundle size | 3.48 MB | <2.8 MB |
| Lighthouse mobile performance on `/feed` | ~55 (est) | 85+ |
| Lighthouse mobile accessibility on `/feed` | ~60 (est) | 95+ |
| Time-to-interactive on `/feed` (mid-range Android) | ~4.5s (est) | <2.5s |
| Bootstrap class count across `src/app` HTML | ~650 | 0 |
| Font Awesome class count across `src/app` HTML | ~180 | 0 |
| Image assets shipped in `src/assets/` | 221 | <30 |
| 3rd-party `<script>` tags in `src/index.html` | 7 | 0 |
| Distinct font-family declarations | 8+ | 2 (Inter + JetBrains Mono) |

### 6.2 Product-level correlates

Not metrics we guarantee because UI doesn't move funnel 1:1, but the
hypotheses worth testing:

1. **Time from landing → first-challenge-complete**: expect 15-25% reduction
   because the post-login surface no longer requires the user to re-orient.
2. **Pro subscription conversion rate**: expect 20-40% lift because a
   premium UI reduces the "is this worth $10/mo?" hesitation.
3. **Employer license close rate**: expect 2-3x lift on outbound demos
   because the product side finally matches the pitch-deck quality.
4. **Candidate referral K-factor**: modest lift expected because the badge
   + OG images are what gets shared, and they already look premium in v3.

None of these are committed as targets — they are what to instrument for
and check in Q3.

---

## Part VII — Explicit rejections

Things the team might consider that V5 does NOT want:

1. **Dark + light theme toggle.** Dark only. Light mode doubles design work
   for <5% of users who'd use it. If SaaS users demand it in 12 months,
   revisit.
2. **Tailwind CSS migration.** We already have a working SCSS + CSS-variable
   system. Moving to Tailwind is a 3-month refactor with zero user value.
3. **Replacing Angular with React/Next.** Out of scope, would invalidate all
   v1-v5 product work.
4. **Building an internal design system in Figma.** We are a 1-2 person
   product team. The code IS the design system. Document components via
   inline Storybook-style pages, not in Figma.
5. **Launching a "v5 launch campaign" before tier 1 pages are migrated.**
   The brand promise must be deliverable on every surface before we market
   it.
6. **Custom illustrations shipped as JPG.** Always SVG. Always.
7. **Photos of humans on the marketing site.** We are not a stock-photo
   product. The product is the proof. Show badges, dashboards, and real
   score screenshots — not smiling African devs on laptops.

---

## Part VIII — What "done" looks like for v5 + v4 combined

At the end of Sprint 3 (roughly 5-6 weeks from v5 kickoff):

1. Every surface — marketing, onboarding, product, dashboards, emails,
   OG images — uses the same tokens, typography, and voice.
2. `src/assets/` contains <30 files. No PSDs, no Osahan template leftovers.
3. `src/index.html` loads zero third-party JS.
4. Lighthouse mobile performance ≥85 on all Tier 1 pages.
5. AI-pair challenge (F17) shipped and first 100 completions recorded.
6. 3 AI-tool vendors approached for sponsorship (F21).
7. Initial revenue signal: paying-employer #1 on the new UI + $500/yr
   license. Paying Pro-subscriber count at 50+.
8. Public case study of 1 African developer hired to an NA/EU remote role
   attributing decision to a Richblok AI-native badge.

That is the v5 definition of shipped. Everything else is future-sprint
iteration.

---

## Appendix A — Quick-reference design tokens (copy-paste for components)

```scss
// src/app/shared/ui/tokens.scss

// Colors
$rb-bg: #0A0A0B;
$rb-surface: #111114;
$rb-surface-hi: #18181C;
$rb-border: #27272A;
$rb-border-hi: #3F3F46;
$rb-accent: #1DD1A1;
$rb-accent-2: #22D3EE;
$rb-text: #FAFAFA;
$rb-text-muted: #A1A1AA;
$rb-text-dim: #71717A;
$rb-warning: #FACC15;
$rb-danger: #EF4444;

// Type
$rb-font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$rb-font-mono: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;

// Radii
$rb-radius-sm: 8px;
$rb-radius-md: 12px;
$rb-radius-lg: 16px;
$rb-radius-pill: 999px;

// Spacing (4px base)
$rb-space-1: 4px;
$rb-space-2: 8px;
$rb-space-3: 12px;
$rb-space-4: 16px;
$rb-space-6: 24px;
$rb-space-8: 32px;
$rb-space-12: 48px;
$rb-space-16: 64px;

// Motion
$rb-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
$rb-ease-in: cubic-bezier(0.64, 0, 0.78, 0);
$rb-duration-micro: 150ms;
$rb-duration-macro: 250ms;
$rb-duration-celebration: 400ms;

// Shadows (used sparingly — dark surfaces need elevation via border-color shifts, not shadow)
$rb-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
$rb-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
$rb-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);
```

---

## Appendix B — Voice/tone dictionary

Quick lookup when writing copy. If a phrase from column A appears in the
codebase, it needs rewriting to match column B.

| A (avoid) | B (use) |
|---|---|
| "Oops!", "Ugh!", "Hey there!" | Direct statement of what happened |
| "awesome", "amazing", "epic" | "verified", "complete", "earned" |
| "Let's get started" | "Start free challenge" |
| "Your journey" / "your story" | "Your profile" / "Your verified stories" |
| "🚀 launch" / "🎉 congrats" / "✨ magic" | Dropped or replaced with Lucide icon |
| "Click here" | Verb-lead link text ("Start challenge", "View badge") |
| "Don't miss out" | "Add to calendar" / "Confirm" |
| "Experts agree" / "Studies show" | Cited source or dropped |
| "AI-powered" | "Verified against Claude/Cursor/Copilot output" |
| "Game-changer" | Specific benefit stated |
| "Join the revolution" | "Create your free profile" |

---

## Appendix C — Reference stack (what stays, what goes)

**Stays (v5 compatible)**:
- Angular 17.3 + AngularFire 7 compat
- Firebase 9.6 (compat) — to be modularized in v6
- Stripe (Checkout + webhook)
- Express server.js + Railway
- Service Worker (`@angular/service-worker`)
- ngx-toastr (restyled to V5 tokens)
- ng-circle-progress (wrapped in `<rb-progress>`)
- ngx-ui-loader (route loading)
- ngx-countdown (challenge timer)

**Goes (remove during v5 migration)**:
- Bootstrap 4 CSS + JS + Popper
- jQuery 3.2.1 slim + jQuery 3.3.1 full
- Font Awesome 4.3.0
- peerjs (unused)
- jquery.easypiechart.js (unused)
- range.js (unused)
- Slick carousel (unused in product; check marketing)
- @kolkov/angular-editor (replaced with textarea)
- ng2-pdf-viewer (unused in v4 flows; check `/cv`)

**New (add during v5 migration)**:
- `lucide-angular` (icons)
- (optional) `@angular/google-maps` if location features re-introduced

---

## Appendix D — Sprint 0 + Sprint 1 shortcut execution log (April 2026)

This section records what actually shipped in the first session of V5
implementation, to keep the PRD honest about what's plan vs what's code.

### Done on branch `v5-sprint-0-ui-kit`

**Sprint 0 (UI kit foundation)**:
- `src/app/shared/ui/tokens.scss` — complete design token file (§Appendix A)
- `lucide-angular` installed and integrated
- **Atoms**: `<rb-icon>`, `<rb-button>` (4 variants × 3 sizes), `<rb-input>`
  (with ControlValueAccessor), `<rb-card>` + `<rb-card-title>` + `<rb-eyebrow>`,
  `<rb-chip>` (6 variants)
- **Molecules**: `<rb-stat>`, `<rb-empty-state>`
- Barrel export at `src/app/shared/ui/index.ts`

**Sprint 1 shortcut (`/feed` rewrite as proof-of-concept)**:
- Full rewrite from 2019 Bootstrap social-feed template to a premium personal
  dashboard
- Uses the new UI kit exclusively — zero Bootstrap classes
- Standalone component, lazy-loaded via `loadComponent`
- Shows: weekly stats (challenges/badges/stars/top score), recent activity
  (last 6 badges + STAR profiles), suggested next challenge, CV upload CTA
- Added skeleton loader using the kit tokens
- AppModule declaration removed; route switched to `loadComponent`

**Asset purge**:
- 63 unreferenced Osahan template images + 3 committed PSDs deleted
- 158 image assets remaining in `src/assets/` (target per §4.2 is <30,
  reached as legacy pages migrate in Sprints 1-3)

### Decision point after this session

With the UI kit landed and `/feed` proving the migration pattern works,
the next sessions face this choice:

1. **Continue solo** — migrate the remaining 32 legacy pages at the same
   cadence. ~6 more weeks of focused solo work. Risk: design consistency
   drifts without a second pair of eyes.

2. **Pause V5 execution, hire or pair a designer** — the UI kit + `/feed`
   demonstrate the pattern clearly enough to hand off. A designer paired
   with the founder-engineer can finish Sprints 1-3 in ~3 weeks instead
   of 6. Higher fidelity, more consistent polish.

3. **Hybrid**: migrate the 6 load-bearing Tier-1 pages solo (feed ✓,
   record, evaluate, jobs, profile, participate-to-challenge) — the ones
   90% of users hit daily — then pause. This locks in the biggest UX
   win without committing to the full migration.

**Recommendation**: option 3. The marginal user impact from migrating
`/settings`, `/friends`, `/cv`, etc. is small — those are once-per-month
surfaces. But a premium `/feed`, `/record`, and `/evaluate` is what every
user experiences every session. Ship those and pause to observe.

### Branch status

- `master`: production, Angular 17, PRD v4/v5 docs. Unchanged by this session.
- `v5-sprint-0-ui-kit`: UI kit + new `/feed` shipped. Ready to merge after
  Railway preview smoke test.

### Quantified deltas from this session

| Metric | Before | After |
|---|---|---|
| Raster image assets | 221 | 158 |
| PSDs tracked in git | 3 | 0 |
| UI kit components | 0 | 7 (atoms + molecules) |
| Design tokens centralized | 0 (inline in 12 components) | 1 `tokens.scss` |
| Lazy-loaded routes | 6 | 7 (adds `/feed`) |
| Legacy `<app-header>`+`<app-footer>` pages | 33 | 32 (feed no longer uses them) |
| Bootstrap class count in `/feed` | ~40 | 0 |

---

*End PRD v5.*
*Co-authored by the Richblok founding team and Claude (Anthropic).*
