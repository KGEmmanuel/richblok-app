import { IBaseService } from './IBaseService.service';
import {
  Firestore, CollectionReference, Query, WhereFilterOp,
  collection, collectionData, doc, docData, addDoc, setDoc,
  deleteDoc, query, where, orderBy as fbOrderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBaseEntity } from '../entites/IBaseEntity.class';

/**
 * Modular-SDK BaseService (D7 Day 3).
 *
 * Public API:
 *   - get(id)                     -> Observable<T>            (live)
 *   - list()                      -> Observable<T[]>          (live)
 *   - findBy(key, value, order?)  -> Query                    (modular, use onSnapshot / getDocs / collectionData)
 *   - findByfilters(keys, ops, values, order?) -> Query
 *   - add(item)                   -> Promise<T>
 *   - update(item)                -> Promise<T>
 *   - delete(id)                  -> void
 *
 * Breaking change vs. compat version: findBy / findByfilters now return
 * a modular Query instead of AngularFirestoreCollection. Consumers must
 * use onSnapshot(query, cb), getDocs(query), or collectionData(query).
 * There were only two call sites in the app and both were migrated in
 * this same commit.
 */
export abstract class BaseService<T extends IBaseEntity> implements IBaseService<T> {

  protected col: CollectionReference;
  protected dbpath: string;
  protected orderByField?: string;

  constructor(path: string, protected firestore: Firestore, orderByField?: string) {
    this.dbpath = path;
    this.orderByField = orderByField;
    this.col = collection(this.firestore, path);
  }

  protected baseQuery(): Query {
    return this.orderByField
      ? query(this.col, fbOrderBy(this.orderByField))
      : this.col;
  }

  get(identifier: string): Observable<T> {
    console.log(`[BaseService] get: ${identifier}`);
    const ref = doc(this.firestore, this.dbpath, identifier);
    return docData(ref, { idField: 'id' }).pipe(
      map(d => d as unknown as T)
    );
  }

  list(): Observable<T[]> {
    console.log('[BaseService] list');
    return collectionData(this.baseQuery(), { idField: 'id' }).pipe(
      map(arr => arr as unknown as T[])
    );
  }

  findBy(key: string, value: any, orderby?: string): Query {
    const clauses: any[] = [where(key, '==', value)];
    if (orderby) { clauses.push(fbOrderBy(orderby)); }
    return query(this.col, ...clauses);
  }

  findByfilters(keys: string[], operator: WhereFilterOp[], values: any[], orderby?: string): Query {
    const clauses: any[] = keys.map((k, i) => where(k, operator[i], values[i]));
    if (orderby) { clauses.push(fbOrderBy(orderby)); }
    return query(this.col, ...clauses);
  }

  add(item: T): Promise<T> {
    console.log('[BaseService] adding item', item);
    item.dateCreation = new Date();
    return addDoc(this.col, Object.assign({}, item)).then(ref => ({
      id: ref.id,
      ...(item as any)
    }));
  }

  update(item: T): Promise<T> {
    console.log(`[BaseService] updating item ${item.id}`);
    const ref = doc(this.firestore, this.dbpath, item.id);
    return setDoc(ref, Object.assign({}, item)).then(() => ({
      ...(item as any)
    }));
  }

  delete(id: string): void {
    console.log(`[BaseService] deleting item ${id}`);
    deleteDoc(doc(this.firestore, this.dbpath, id));
  }
}
