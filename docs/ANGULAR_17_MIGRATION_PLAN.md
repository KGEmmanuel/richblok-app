# Angular 9 → 17 + Firebase 7 → 10 Migration Plan (T01)

**Status:** Stages 1 + 2 **complete** on branch `migrate-angular-17`.
Stages 3–5 pending — each needs a dedicated session with manual smoke testing.

| Stage | Version | Branch commit | Browser build | Server build |
|-------|---------|---------------|---------------|--------------|
| 1 | 9 → 10 | `migrate-angular-17` | ✅ green | ✅ green |
| 2 | 10 → 11 | `migrate-angular-17` HEAD | ✅ green | ✅ green |
| 3 | 11 → 12 + Firebase 7 → 9 compat | — | — | — |
| 4 | 12 → 15 | — | — | — |
| 5 | 15 → 17 + modular Firebase SDK + lazy loading | — | — | — |

This is a deliberate, multi-day migration that should own its own session
per stage; it touches ~100+ files and every guard, interceptor, and service
that imports from `@angular/fire` or `firebase/app`.

## Why it's expensive
- AngularFire v5 (`AngularFireAuth`, `AngularFirestore`) is incompatible with
  Angular 16+. The whole data layer must be rewritten to the modular SDK.
- Firebase 7 uses `firebase.firestore.FieldValue.serverTimestamp()` (namespaced).
  Firebase 10 uses `serverTimestamp()` imported from `firebase/firestore`.
  There are ~100 sites where this needs to change.
- RxJS 6 → RxJS 7 requires changing `.toPromise()` → `firstValueFrom()`, adjusting
  `combineLatest`, `pluck`, etc.
- Angular 9 components with `entryComponents`, injected `HttpHandler`, and
  legacy `@NgModule`-style routing must move to standalone components if we go
  to v17's recommended style.

## Migration path (sequenced, each step runs `ng serve` cleanly before the next)

### Stage 1 — Angular 9 → 10 ✅ DONE
- `ng update @angular/cli@10 @angular/core@10 --allow-dirty --force`
- Manual `npm install --legacy-peer-deps` after schematics wrote package.json
  (the default npm install fails because `@agm/core@1.1.0` peer-depends on
  Angular 6-8; `--legacy-peer-deps` accepts this)
- TypeScript 3.7 → 4.0 compiled without any catch-clause or strictness errors
- `@angular/fire@5` stays on this branch; it works against v10 runtime
- Build verified: both browser (`ng build --prod`) and server
  (`ng run Rib:server:production`) bundles compile

### Stage 2 — Angular 10 → 11 ✅ DONE
- `ng update @angular/cli@11 @angular/core@11 --allow-dirty --force`
- ng schematics rewrote package.json correctly but npm-install inside the
  update failed because `@angular-devkit/build-angular@~0.1102.19` peer-
  requires `@angular/compiler-cli@^11.0.0`; npm errors without
  `--legacy-peer-deps`. Workaround: let `ng update` write package.json,
  then run `npm install --legacy-peer-deps --ignore-scripts` manually.
- TypeScript stays at 4.0.8 (Angular 11 supports 4.0–4.1)
- Zone.js stays at 0.10.3
- No source changes required — our codebase compiles clean against 11
- Build verified: both browser + server bundles green
- **Smoke tests still pending for this stage**:
  - [ ] Login with email+password
  - [ ] Google OAuth
  - [ ] Challenge submission + badge creation
  - [ ] STAR profile generation via /api/star-map
  - [ ] AI Coach streaming /api/coach/stream
  - [ ] CV upload → /api/cv-extract → /api/cv-to-star
  - [ ] Employer dashboard competency filter
  - [ ] University dashboard pilot-preview banner
  - [ ] Admin challenge editor CRUD
  - [ ] Stripe checkout redirect (pro, employer, sponsor)

### Stage 3 — Angular 11 → 12 + Firebase 7 → 9 compat (next)
- `ng update @angular/cli@12 @angular/core@12`
- Bump Node to 14 or 16 (CLI 12 requires >= 12.13 or 14.15)
- `npm i firebase@9 @angular/fire@6 --save --legacy-peer-deps`
- Replace every `import * as firebase from 'firebase/app'` with
  `import firebase from 'firebase/compat/app'`; similarly for
  `firebase/auth` → `firebase/compat/auth`, `firebase/firestore` →
  `firebase/compat/firestore`. This is a mechanical ~80-site change.
- AngularFire 5 stays (name-compatible with v6 in compat mode).

### Stage 2 — Firebase 7 → 9 compat layer
- Upgrade `firebase` to v9 using the `compat` imports first:
  - `firebase/compat/app`, `firebase/compat/firestore`, `firebase/compat/auth`.
- Keep `@angular/fire@6` (the last version compatible with our v9-compat style).
- Run full regression — login, Firestore reads/writes, guards.

### Stage 3 — Angular 12 → 15
- `ng update @angular/core@13` → 14 → 15 in sequence.
- Fix `any` typing in Firestore snapshots; `snapshotChanges()` payload typing
  changed.
- Replace deprecated `View Engine` artifacts; Angular 13+ is Ivy-only.
- Bump `rxjs` to 7 with `rxjs/operators` → `rxjs` imports.

### Stage 4 — Angular 15 → 17 + AngularFire 7+ (modular)
- `ng update @angular/core@16` → 17.
- Replace all `AngularFireAuth` with `Auth` from `@angular/fire/auth` (modular).
- Replace all `AngularFirestore` with `Firestore` + modular functions
  (`collection`, `doc`, `query`, `where`, `getDocs`, `addDoc`, `updateDoc`).
- Replace `firebase.firestore.FieldValue.serverTimestamp()` with
  `serverTimestamp()` from `firebase/firestore`.
- Components that use `@Injectable({ providedIn: 'root' })` stay the same;
  module-scoped providers need `inject()` migration.

### Stage 5 — Lazy loading (T03, pairs well with v17)
- Convert every eager `component:` route in `app-routing.module.ts` to
  `loadComponent: () => import('./...').then(m => m.XComponent)`.
- Convert feature modules with sub-routes to
  `loadChildren: () => import(...).then(m => m.XModule)`.
- Expected: initial bundle ~4.4MB → ~500KB first-paint chunk.

## Estimated effort
| Stage | Days | Risk |
|-------|------|------|
| 1 — 9→12 | 1 | Low-medium (webpack 5 break, zone.js) |
| 2 — Firebase compat | 0.5 | Low |
| 3 — 12→15 | 1 | Medium (RxJS 7 breaking changes) |
| 4 — 15→17 + modular SDK | 2 | **High** — biggest surface area |
| 5 — Lazy loading | 0.5 | Low |
| **Total** | **~5 days** | |

## Mitigation strategy
- Work on a dedicated branch (`migrate-angular-17`) — never in `master`.
- After each stage: full manual smoke test + deploy to a Railway preview env.
- Keep the production `master` on Angular 9 while the migration branch runs
  parallel (master keeps shipping features; migrate only rebases weekly).
- Don't merge until all PRD v3 flows pass end-to-end on the migration branch.

## What this migration unlocks
- Lighthouse mobile score 60 → 90+ (code-splitting)
- Bundle 4.4MB → ~500KB initial paint
- Modern tree-shaking for Firebase (removes ~40% of `vendor.js`)
- Typed Firestore refs (compile-time safety on collection schemas)
- Modern Signals API (optional, for future reactivity rework)

## Explicit decision
**Defer to a dedicated migration sprint.** The current $10K-MRR revenue push is
better served by wiring Stripe, fixing the employer competency filter, adding
institution multi-tenancy, and shipping sponsored challenges — all of which
landed in the same session this plan was written in. Revenue gaps > bundle size.
