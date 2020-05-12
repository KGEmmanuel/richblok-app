import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { QueryConfig } from './QueryConfig';
import { take, scan } from 'rxjs/operators';

@Injectable()
export class PaginationService {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  loadWithFilter = false;
  keys: string[]; operator: firebase.firestore.WhereFilterOp[]; values: object[];

  constructor(private afs: AngularFirestore) { }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
    this.query = {
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    };
    // console.log('query', this.query);


    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });
    this.mapAndUpdate(first);
    // Create the observable array for consumption in components
    this.data = this._data.asObservable()
      .pipe(scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      }));
  }

  initWithFilter(path: string, field: string, keys: string[], operator: firebase.firestore.WhereFilterOp[], values: object[], opts?: any) {
    this.query = {
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
    // console.log('query', this.query);
    const first = this.afs.collection(this.query.path, ref => {
      let qu: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      let i = 0;
      keys.forEach(s => {
        qu = qu.where(s, operator[i], values[i]);
        console.log(s);
        console.log(qu);

        i++;
      });
      return qu
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });
    this.mapAndUpdate(first);
    // Create the observable array for consumption in components
    this.data = this._data.asObservable()
      .pipe(scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      }));
  }




  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();
    if (this.loadWithFilter) {
      const more = this.afs.collection(this.query.path, ref => {
        let qu: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        let i = 0;
        this.keys.forEach(s => {
          qu = qu.where(s, this.operator[i], this.values[i]);
          console.log(s);
          console.log(qu);

          i++;
        });
        return qu
          .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
          .limit(this.query.limit)
          .startAfter(cursor);
      });
      this.mapAndUpdate(more);
    }
    else {
      const more = this.afs.collection(this.query.path, ref => {
        return ref
          .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
          .limit(this.query.limit)
          .startAfter(cursor);
      });
      this.mapAndUpdate(more);
    }

  }


  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc
    }
    return null;
  }


  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {

    if (this._done.value || this._loading.value) { return; };

    // loading
    this._loading.next(true)

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          return { ...data, doc };
        });

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values

        // update source with new values, done loading
        this._data.next(values)
        this._loading.next(false)

        // no more values, mark done
        if (!values.length) {
          this._done.next(true)
        }
      })
      .take(1)
      .subscribe();

  }

}
