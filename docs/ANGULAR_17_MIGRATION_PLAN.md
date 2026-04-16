# Angular 9 → 17 + Firebase 7 → 10 Migration Plan (T01)

**Status: ✅ COMPLETE on branch `migrate-angular-17`.** Angular 9 → 17 + TypeScript 3.7 → 5.4 + Firebase 7 → 9 (compat) + @angular/fire 5 → 7 (compat) + initial lazy loading. Smoke testing still required before merging to master.

| Stage | Version | Browser build | Server build |
|-------|---------|---------------|--------------|
| 1 | 9 → 10 (TS 3.7 → 4.0) | ✅ green | ✅ green |
| 2 | 10 → 11 | ✅ green | ✅ green |
| 3 | 11 → 12 + Firebase 7 → 9 compat + @angular/fire 5 → 7 | ✅ green | ✅ green |
| 4A | 12 → 13 (Ivy-only, single bundle) | ✅ green | — |
| 4B | 13 → 14 (typed forms, ES2020 target) | ✅ green | — |
| 4C | 14 → 15 (TS 4.9.5, ES2022 target) | ✅ green | ✅ green |
| 5A | 15 → 16 + lib bumps (ng-bootstrap, toastr, cdk) + RxJS 7 | ✅ green | ✅ green |
| 5B | 16 → 17 (TS 5.4, zone 0.14) | ✅ green | ✅ green |
| 5C | 6 standalone lazy-loaded routes | ✅ 3.48 MB initial | ✅ green |

This was a deliberate, multi-stage migration across 15 checkpoint commits that
touched ~100 files. Final modernization of the Firebase SDK to full modular
(tree-shakeable `firebase/*` imports instead of `firebase/compat/*`) and full
lazy loading of all 50+ routes are tracked as follow-up work.

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

### Stage 3 — Angular 11 → 12 + Firebase 7 → 9 compat + @angular/fire 5 → 7 ✅ DONE
Done as 3 checkpoint commits so each can be inspected / rolled back:

**3A — Angular core only**
- `ng update @angular/cli@12 @angular/core@12 --allow-dirty --force`
- typescript 4.0.8 → 4.3.5, zone.js 0.10.3 → 0.11.8
- Firebase still at 7.x — build passes, proves the Angular jump is clean
  in isolation from Firebase risk

**3B — deps bump**
- `firebase: 7.9.1 → 9.6.0` (pinned exact — later 9.x ship inline-type
  imports in .d.ts which break TS 4.3 parser; 9.6.0 is the last safe
  release for our TS range)
- `@angular/fire: 5.4.2 → 7.6.1`

**3C — Compat import rewrites (151 sites across 75 files)**
Used a Python script to do mechanical, bulk regex rewrites — see commit.

| From | To | Sites |
|------|----|----|
| `import * as firebase from 'firebase/app'` | `import firebase from 'firebase/compat/app'` | 11 |
| `import * as firebase from 'firebase'` | `import firebase from 'firebase/compat/app'` + compat/auth + compat/firestore side-effects | 42 |
| `from 'firebase/<mod>'` | `from 'firebase/compat/<mod>'` | 98 |
| `from '@angular/fire'`, `/auth`, `/firestore`, `/storage`, etc. | `@angular/fire/compat` + subpath | 109 |
| `this.afAuth.auth.X(...)` | `this.afAuth.X(...)` | ~15 (AF7 compat re-exposes Auth methods directly on AngularFireAuth) |
| `@angular/fire/firestore/interfaces` | `@angular/fire/compat/firestore` | 1 (path removed in AF7) |

Manual one-off fixes:
- `auth.service.ts SendVerificationMail`: `.currentUser` is now `Promise<User>` in AF7 compat → converted to async/await
- Two files had stray `FirebaseAuth` imports from `@angular/fire/compat` — removed (not exported there)
- Added `firebase/compat/firestore` side-effect imports where `firebase.firestore.X` is used as a type (pagination.service, BasetService)
- `tsconfig.json`: added `"skipLibCheck": true` (safety net for legacy d.ts files)

Dependency hoisting gotcha:
- `@angular/fire@7.6.1` peer-installs its own nested firebase at 9.23 which
  pulls in inline-type-import .d.ts that break TS 4.3 *as syntax errors*
  (skipLibCheck doesn't help — these are parser errors)
- `overrides` + `$firebase` alias in package.json didn't work in the
  installed npm version
- **Fix**: `postinstall` hook that deletes `node_modules/@angular/fire/node_modules`
  after every install. Node's normal resolution then falls back to the
  root firebase@9.6.0 — all types reconcile.

Build verified: both browser + server bundles green.

**Smoke tests STILL PENDING for this stage** (same 10-flow checklist as Stage 2):
- [ ] Login with email+password
- [ ] Google OAuth
- [ ] Challenge submission + badge creation
- [ ] STAR profile generation
- [ ] AI Coach streaming
- [ ] CV upload → STAR draft
- [ ] Employer dashboard competency filter
- [ ] University dashboard pilot-preview
- [ ] Admin challenge editor CRUD
- [ ] Stripe checkout redirects

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
