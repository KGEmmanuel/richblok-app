import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { take, tap, scan } from 'rxjs/operators';
import {
  Firestore, Query, WhereFilterOp,
  collection, getDocs, limit as fbLimit, orderBy, query, startAfter, where
} from '@angular/fire/firestore';
import { QueryConfig } from './QueryConfig';

@Injectable()
export class PaginationService {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject<any[]>([]);

  private queryCfg: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  loadWithFilter = false;
  keys: string[];
  operator: WhereFilterOp[];
  values: object[];

  private firestore = inject(Firestore);

  constructor() { }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
    this.queryCfg = {
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    };

    const first = query(
      collection(this.firestore, this.queryCfg.path),
      orderBy(this.queryCfg.field, this.queryCfg.reverse ? 'desc' : 'asc'),
      fbLimit(this.queryCfg.limit)
    );
    this.mapAndUpdate(first);
    this.data = this._data.asObservable()
      .pipe(scan((acc, val) => {
        return this.queryCfg.prepend ? val.concat(acc) : acc.concat(val);
      }));
  }

  initWithFilter(path: string, field: string, keys: string[], operator: WhereFilterOp[], values: object[], opts?: any) {
    this.queryCfg = {
      path,
      field,
      limit: 10,
      reverse: false,
      prepend: false,
      ...opts
    };
    this.loadWithFilter = true;
    this.keys = keys;
    this.operator = operator;
    this.values = values;

    const clauses: any[] = keys.map((s, i) => where(s, operator[i], values[i]));
    clauses.push(orderBy(this.queryCfg.field, this.queryCfg.reverse ? 'desc' : 'asc'));
    clauses.push(fbLimit(this.queryCfg.limit));
    const first = query(collection(this.firestore, this.queryCfg.path), ...clauses);
    this.mapAndUpdate(first);
    this.data = this._data.asObservable()
      .pipe(scan((acc, val) => {
        return this.queryCfg.prepend ? val.concat(acc) : acc.concat(val);
      }));
  }




  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();
    const base = collection(this.firestore, this.queryCfg.path);
    if (this.loadWithFilter) {
      const clauses: any[] = this.keys.map((s, i) => where(s, this.operator[i], this.values[i]));
      clauses.push(orderBy(this.queryCfg.field, this.queryCfg.reverse ? 'desc' : 'asc'));
      clauses.push(fbLimit(this.queryCfg.limit));
      if (cursor) { clauses.push(startAfter(cursor)); }
      const more = query(base, ...clauses);
      this.mapAndUpdate(more);
    } else {
      const clauses: any[] = [
        orderBy(this.queryCfg.field, this.queryCfg.reverse ? 'desc' : 'asc'),
        fbLimit(this.queryCfg.limit),
      ];
      if (cursor) { clauses.push(startAfter(cursor)); }
      const more = query(base, ...clauses);
      this.mapAndUpdate(more);
    }
  }


  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.queryCfg.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }


  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(q: Query) {

    if (this._done.value || this._loading.value) { return; }

    // loading
    this._loading.next(true);

    // One-shot snapshot with doc ref (needed for cursor)
    return from(getDocs(q))
      .pipe(
        tap(snap => {
          let values = snap.docs.map(d => {
            const data = d.data();
            return { ...data, doc: d };
          });

          // If prepending, reverse the batch order
          values = this.queryCfg.prepend ? values.reverse() : values;

          // update source with new values, done loading
          this._data.next(values);
          this._loading.next(false);

          // no more values, mark done
          if (!values.length) {
            this._done.next(true);
          }
        }),
        take(1)
      )
      .subscribe();

  }

}
