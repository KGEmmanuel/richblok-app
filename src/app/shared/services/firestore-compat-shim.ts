import { Query, QuerySnapshot, DocumentReference, DocumentSnapshot, onSnapshot } from '@angular/fire/firestore';

/**
 * Thin wrappers that expose the legacy compat chainable shape
 * (`.onSnapshot(cb)` and `.ref.onSnapshot(cb)`) on top of modular
 * `Query` / `DocumentReference`. These let existing callers keep their
 * `svc.foo().onSnapshot(...)` call sites during the D7 Day 4 service
 * sweep — without touching every consumer in the same commit.
 *
 * Once all callers are migrated to direct `onSnapshot(query, cb)` usage
 * these shims can be deleted.
 */

export interface SnapshotQueryShim {
  onSnapshot(cb: (s: QuerySnapshot) => void): () => void;
  ref: { onSnapshot(cb: (s: QuerySnapshot) => void): () => void };
}

export function snapshotQuery(q: Query): SnapshotQueryShim {
  const onSnap = (cb: (s: QuerySnapshot) => void) => onSnapshot(q, cb);
  return {
    onSnapshot: onSnap,
    ref: { onSnapshot: onSnap },
  };
}

export interface SnapshotDocShim {
  onSnapshot(cb: (s: DocumentSnapshot) => void): () => void;
  ref: { onSnapshot(cb: (s: DocumentSnapshot) => void): () => void };
}

export function snapshotDoc(d: DocumentReference): SnapshotDocShim {
  const onSnap = (cb: (s: DocumentSnapshot) => void) => onSnapshot(d, cb);
  return {
    onSnapshot: onSnap,
    ref: { onSnapshot: onSnap },
  };
}
