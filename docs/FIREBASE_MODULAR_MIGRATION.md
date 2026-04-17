# D7 — Full modular Firebase SDK migration

## Status: planned, NOT started. ~400 KB savings awaiting.

This is Tier D7 from the roadmap. The effort estimate is 2-3 days of
focused mechanical refactoring. Like D2 (Bootstrap kill), this is **not
a drip-feed task** — partial migration leaves both SDKs loaded and you
pay for both.

## Why it matters

The app imports Firebase via the `@angular/fire/compat/*` package
tree. `/compat/` is AngularFire's backward-compat shim for the
**namespaced (v8)** Firebase SDK — which is the one that ships ~400KB
more code than the modular (v9+) SDK. Specifically, compat pulls in
the entire `firebase/app`, `firebase/auth`, `firebase/firestore`, etc.
as one bundle regardless of what you actually use.

The modular SDK (`@angular/fire` non-compat + `firebase/*` v9+ tree-
shakeable imports) ships only the functions you call.

Measured on a current build:
- Compat bundle: main.js = 3.53 MB
- Modular bundle (estimated): ~3.13 MB (-400 KB, -11%)

That 400 KB shows up directly on p75 mobile First Contentful Paint
in African markets — our core demographic on 3G.

## Scope of the migration

**64 TypeScript files** import from `@angular/fire/compat/*` today.
Each needs to be rewritten. The pattern is mechanical but exhaustive:

```bash
grep -rn "@angular/fire/compat" src/app/ | wc -l  # snapshot the count
```

### Migration pattern (per file)

Old (compat):
```typescript
import { AngularFirestore } from '@angular/fire/compat/firestore';

constructor(private afs: AngularFirestore) {}

ngOnInit() {
  this.afs.collection('badges').get().subscribe(snap => { ... });
}
```

New (modular):
```typescript
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

constructor(private firestore: Firestore) {}

async ngOnInit() {
  const snap = await getDocs(collection(this.firestore, 'badges'));
  snap.forEach(d => { ... });
}
```

### Import mapping table

| Compat | Modular |
|---|---|
| `@angular/fire/compat` → `AngularFireModule.initializeApp()` | `provideFirebaseApp(() => initializeApp(...))` |
| `@angular/fire/compat/auth` → `AngularFireAuth` | `Auth` + `signInWithPopup(auth, provider)` |
| `@angular/fire/compat/firestore` → `AngularFirestore` | `Firestore` + `collection/doc/getDoc/getDocs/addDoc/setDoc` |
| `.valueChanges()` | `collectionData(collection(firestore, name))` |
| `.snapshotChanges()` | `docData(doc(firestore, name, id), { idField: 'id' })` |
| `firebase.firestore.FieldValue.serverTimestamp()` | `serverTimestamp()` from `@angular/fire/firestore` |
| `firebase.firestore.Timestamp.now()` | `Timestamp.now()` from `@angular/fire/firestore` |
| `afAuth.authState.pipe(first()).toPromise()` | `authState(auth).pipe(first()).toPromise()` or `firstValueFrom(authState(auth))` |

### AppModule change

Today:
```typescript
imports: [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireAuthModule,
  AngularFirestoreModule,
  AngularFireStorageModule,
  // ...
]
```

Modular equivalent (uses Angular providers):
```typescript
providers: [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  provideStorage(() => getStorage()),
]
```

## Execution plan (2-3 days)

### Day 1 — bootstrap + services (the foundation)

Migrate in this order so each layer stays importable:

1. `app.module.ts` — swap `AngularFireModule.initializeApp` etc. for
   `provideFirebaseApp` / `provideAuth` / `provideFirestore` providers.
   This is ~15 minutes but CANNOT BE MERGED until day 3 because every
   service that still imports compat will break simultaneously.
2. `src/app/shared/services/*.ts` — migrate all service classes.
   About 15 files. Each takes ~10-15 minutes of mechanical rewriting.
3. Run `ng build` after each service migration to catch regressions early.

### Day 2 — page components (the bulk)

About 40 components import `AngularFirestore` or `AngularFireAuth`
directly in their constructors. Rewrite each. Most are <20 lines of
compat code per file.

Run the full app locally after every 10 components and click through
the pages you migrated.

### Day 3 — tests + edge cases + verification

- Server-side (`server.js`) uses `firebase-admin`, which is a
  different package entirely — NOT affected by this migration.
- `AngularFirestore.collection(name, ref => ref.where(...))` has a
  different signature in modular. The modular version takes the ref
  builder as a separate `query(collection(...), where(...))` wrapper.
- Run all 23 server tests — they don't exercise client Firebase so
  should stay green.
- Manual walkthrough: sign in, dashboard, take a challenge, earn a
  badge, visit /ai-native, visit /leaderboard, visit /employer.

Acceptance:
- [ ] `grep -rn "@angular/fire/compat" src/` returns 0
- [ ] `ng build` produces a main.js smaller than the pre-migration
      build by ≥350 KB
- [ ] All smoke-test paths work (sign in, /feed, /evaluate,
      /ai-pair/:slug, /badge/:id)

## Anti-goals — do NOT

- Partial migration. Either move all 64 files or none. Half-migrated
  ships BOTH SDKs and costs 400 KB MORE, not less.
- Rewriting the server-side `firebase-admin` code. Separate package,
  not affected.
- Changing behavior while migrating. This is a pure refactor. Keep
  `.valueChanges()` subscription patterns even when the modular
  equivalent would be `firstValueFrom`.

## Pilot — is it worth it?

Before committing 2-3 days, pilot on ONE file:
`src/app/shared/services/auth.service.ts`. It's small, it's the most
frequently-used service, and if migration looks messy there it'll be
messy everywhere.

1. Branch: `feat/firebase-modular-pilot`
2. Migrate `auth.service.ts` only. Leave everything else on compat.
3. Run `ng build`. If it still builds (modular + compat can coexist
   during migration as long as you don't import the SAME thing both
   ways), great — the full migration is a matter of volume.
4. If it breaks, read the error, figure out which module you still
   need to pull in, and document it here before proceeding.

## Why not just lazy-load Firebase?

You could ship a route-level lazy-load that pulls Firebase compat
only when needed (sign-in page, dashboard). That'd save ~150KB on
the `/landing` and `/sponsor` public pages without any refactor —
a cheap win. Consider it a bridge while the full modular migration
sits in the backlog.

Tracked: `grep -rn 'TODO(firebase-modular)' src/` for the pilot
points.
