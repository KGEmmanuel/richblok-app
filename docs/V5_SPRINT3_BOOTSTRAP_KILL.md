# V5 Sprint 3 — kill Bootstrap + `<app-header>` / `<app-footer>`

## Status: planned, not started

This is Tier D2 from the roadmap. The effort estimate is 1-2 weeks of
focused human work. Partial progress is actively dangerous — a half-killed
Bootstrap leaves half the UI broken. Execute as a single sprint, not a
drip-feed.

## Why we haven't started

As of master (today), **281 usages of `data-toggle` / `data-dismiss`**
remain across templates. Bootstrap 4's JavaScript component library
(modals, dropdowns, tabs, collapses) is actively wired to these. Removing
the `bootstrap.min.js` script OR the bootstrap CSS bundle without
rewriting all 281 call sites breaks those components silently.

```bash
# Find the blast radius:
grep -rn 'data-toggle\|data-dismiss\|data-target\|data-ride' src/app/ | wc -l
```

Additionally:
- `<app-header>` renders on ~40 legacy pages; `<app-footer>` renders on
  ~50. Both assume Bootstrap's grid (`container`, `row`, `col-*`).
- Legacy pages use `col-lg-6 col-md-12` sidebars, `btn btn-primary`,
  `form-control`, `card card-body` — all Bootstrap 4 classes.

## The sprint plan (1-2 weeks, in order)

### Week 1, days 1-3 — swap JS components to ng-bootstrap

`ng-bootstrap` (the Angular-native port) is already a dependency
(`NgbModule` in AppModule). Migrate interaction components first —
those are the ones that require `bootstrap.min.js` to function.

| `data-toggle` value | Replacement |
|---|---|
| `modal` + `data-target="#x"` | `NgbModal` service (`modalService.open(TemplateRef)`) |
| `dropdown` | `NgbDropdown` directive |
| `tab` | `NgbNav` directive |
| `collapse` | `[ngbCollapse]` directive |
| `tooltip` | `[ngbTooltip]` directive |

Rough estimate: 281 data-toggle sites / ~30-40 sites per day = ~7-9 days.
Each site is mechanical but must be tested visually.

### Week 1, days 4-5 — migrate Bootstrap grid to CSS grid

Legacy: `<div class="row"><div class="col-lg-8 col-md-12">...</div></div>`
V5:     `<section class="page-grid">...</section>` with
        ```
        .page-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--sp-3);
        }
        ```

Each page migration follows the `/evaluate` pattern (already shipped):
wrap in `<rb-app-shell>` or `<rb-public-shell>` and drop the grid
entirely unless the page genuinely needs side-columns (most don't).

### Week 2, days 1-3 — delete `<app-header>` and `<app-footer>`

Once all pages that used them have been migrated to `<rb-app-shell>`
or `<rb-public-shell>`, the two legacy components are safe to remove:

```bash
git grep 'app-header\|app-footer' src/app/  # should be 0 at this point
rm -rf src/app/shared/components/header src/app/shared/components/footer
# Also remove declarations from app.module.ts
```

### Week 2, days 4-5 — remove Bootstrap from the stylesheet

At this point no template uses Bootstrap utility classes. Remove
`bootstrap` from `angular.json > projects.richblok.architect.build.options.styles`,
and delete `popper.min.js` and `bootstrap.min.js` from `src/index.html`.

Expected savings after this sprint:
- Bootstrap CSS: ~150 KB minified
- Bootstrap JS: ~60 KB minified
- popper JS: ~20 KB minified
- `<app-header>`/`<app-footer>` TypeScript + templates: ~5 KB
- **Total: ~235 KB** shaved off every initial page load.

## Acceptance criteria

- [ ] `grep -rn 'data-toggle' src/app/` returns 0
- [ ] `grep -rn 'col-lg\|col-md\|col-sm' src/app/` returns 0
- [ ] `grep -rn '<app-header\|<app-footer' src/app/` returns 0
- [ ] `angular.json` `styles` no longer references bootstrap
- [ ] `src/index.html` no longer references popper or bootstrap.min.js
- [ ] `/feed`, `/evaluate`, `/record`, `/jobs`, `/profile`, `/employer/dashboard`,
      `/university/dashboard`, `/admin`, `/admin/ai-pair/review`,
      `/ai-pair/:slug`, `/ai-native`, `/leaderboard` all load visually
      clean (manual walkthrough)
- [ ] `/sign-in`, `/sign-up`, `/landing`, `/terms`, `/policy`, `/contact`,
      `/sponsor` all load visually clean
- [ ] Lighthouse score on `/feed` before/after: ideally +10 perf points
      from the bundle-size drop

## Inline TODO markers

Anchored in the codebase so grep surfaces the work:

```bash
grep -rn 'TODO(v5-sprint3)' src/
```

Every page migration lands as its own PR; merge order is flexible but
roughly bottom-up (fewer dependencies first: auth pages → marketing →
profile pages → admin → employer).

## Why this is NOT a doable-in-one-afternoon task

281 data-toggle sites × ~3 minutes per mechanical conversion + visual
regression test = ~14 hours of concentration, minimum. Plus the grid +
header/footer + bootstrap removal. **Don't try to do it in fragments.**
Pick a week, close everything else, ship it.
