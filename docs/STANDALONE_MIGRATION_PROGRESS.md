# Option A — incremental standalone migration (on `standalone-shared-components` branch)

This tracks the ongoing conversion of NgModule-declared components to
standalone. Goal: enable lazy-loading of the remaining feature pages
(Feed, Jobs, Record, Demonstrate) by first making their widget trees
standalone-compatible.

## Done

**Stacked on top of `migrate-angular-17`:**

| Commit | What |
|---|---|
| `28a3f12` | Header + Footer + 4 content pages (terms/policy/contact/404) |
| `412ef3b` | 4 dashboards (admin, admin-challenges, employer, university) |
| `1ae3e8b` | **Batch 1** — 6 leaf widgets (UserCard, RibSolutions, FollowOrgs, IncitationItem, ConnectionAsideItem, JobAsideItem) |
| `ed51ad8` | **Batch 2** — 6 mid-level widgets (UserslistInline + Item, JobsItem, ConnectionAside, JobAside, DemonstrateSuggestion) |
| _this commit_ | **Batch 3 partial** — 2 Demonstrate leaves (Dashboard, Item) |

**Running total: 26 components converted to standalone.**

Build output:
- `migrate-angular-17` HEAD: 3.48 MB initial, 11 chunks
- `standalone-shared-components` HEAD: **3.36 MB initial, 21+ chunks**

## Pattern used

Each conversion does 3 things:
1. Component decorator gains `standalone: true` + explicit `imports: [CommonModule, ...]` array
2. Component removed from `AppModule.declarations`
3. Component added to `AppModule.imports` array (so eager NgModule pages that still use the selector compile)

For widgets that render other `<app-xxx>` children: those children are listed in the widget's own `imports:` array. The chain cascades — standalone at the top, leaves can still be NgModule-declared IF they're ALSO in `AppModule.imports` (where they appear as standalone).

## Blockers preventing full lazy-load of remaining feature pages

Each of these pages uses widgets with **deep NgModule-declared subtrees** that aren't standalone yet:

### DemonstrateComponent → blocked by `DemonstrateListe` → `PostList`
- `<app-demonstrate-liste>` contains only `<app-post-list [type]="'Demonstration'" ...>`
- `PostListComponent` uses: FriendSuggestionItem, LoadingSpinner, PostForm, PostItem
- `PostItem` → CertifyItem, Initchat, PostComments, PostShare
- Depth: ~3 levels, ~10 components to convert

### FeedComponent → same PostList tree + PostForm tree
- Also needs ConnectionAside (done ✓), JobAside (done ✓), RibSolutions (done ✓), UserCard (done ✓), FollowOrgs (done ✓), DemonstrateSuggestion (done ✓)
- But PostList and PostForm are still NgModule-declared
- `PostForm` → PostLocation, PostIdentify, IdentifiedUsers + Item + List, + GooglePlaceDirective
- Depth: ~2 levels, ~6 more components

### RecordComponent → record-skills + record-experiences etc. trees
- Each record-* component has its own Item + Form children
- Depth: ~2 levels, ~15 components

### JobsComponent → JobsApplied + JobsCreated trees
- `JobsApplied` → JobsAppliedItem, JobsAppliedDetails
- `JobsCreated` → smaller tree
- Depth: ~2 levels, ~5 components

## Decision point for the next session

**Option A-continued**: Keep going. Another 2-3 sessions to finish the whole widget tree, then lazy-load all 4 feature pages. Low risk per commit but high calendar time.

**Option B-late**: Stop the incremental grind, extract a `SharedModule` that declares the remaining widgets. Both `AppModule` and new `FeedModule`/`RecordModule`/`DemonstrateModule`/`JobsModule` import `SharedModule`. Each feature module is a single `loadChildren` route. Faster end-state but one big commit.

Recommendation: **Option B-late**. The progress so far proved the migration is viable; continuing one-widget-at-a-time adds little information. A SharedModule extraction lets every remaining feature page lazy-load in one structured commit.

## What's safe to merge now

Both `migrate-angular-17` and `standalone-shared-components` are independently mergeable. The partial progress so far doesn't cause any runtime regressions — every NgModule-declared component that uses a widget as a selector still works because the widgets are now in `AppModule.imports` as standalone.

**Merge order**: `migrate-angular-17` → `master` first (after Railway smoke test), then `standalone-shared-components` → `master`.
