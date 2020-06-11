<<<<<<< HEAD
import { IBaseService } from './IBaseService.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IBaseEntity } from '../entites/IBaseEntity.class';
export abstract class BaseService<T extends IBaseEntity> implements IBaseService<T> {

  protected collection: AngularFirestoreCollection<T>;
  protected dbpath;

  constructor(path: string, protected afs: AngularFirestore, orderBy?: string) {
    if (orderBy) {
      this.collection = this.afs.collection<T>(path, ref => ref.orderBy(orderBy));
    } else {
      this.collection = this.afs.collection<T>(path);
    }
    // alert(path);
    this.dbpath = path;
  }
  get(identifier: string): Observable<T> {
    console.log(`[BaseService] get: ${identifier}`);

    return this.collection
      .doc<T>(identifier)
      .snapshotChanges()
      .pipe(
        map(doc => {
          if (doc.payload.exists) {
            /* workaround until spread works with generic types */
            const data = doc.payload.data() as T;
            console.log('doc is ...', doc.payload.data());
            const id = doc.payload.id;
            return { id, ...data };
          }
        })
      );
  }


  list(): Observable<T[]> {
    console.log(`[BaseService] list`);
    return this.collection
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as T;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  findBy(key: string, value: any, orderby?: string) {
    if (orderby) {
      return this.afs.collection(this.dbpath, ref => ref.where(key, '==', value).orderBy(orderby));
    } else {
      return this.afs.collection(this.dbpath, ref => ref.where(key, '==', value));
    }
  }

  findByfilters(keys: string[], operator: firebase.firestore.WhereFilterOp[], values: object[], orderby?: string) {
    return this.afs.collection(this.dbpath, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      let i = 0;
      keys.forEach(s => {
        query = query.where(s, operator[i], values[i]);
        i++;
      });
      if (orderby) {
        return query.orderBy(orderby);
      }
      return query;
    });
  }

  add(item: T): Promise<T> {
    console.log('[BaseService] adding item', item);
    item.dateCreation = new Date();
    const promise = new Promise<T>((resolve, reject) => {
      this.collection.add(item).then(ref => {
        const newItem = {
          id: ref.id,

          /* workaround until spread works with generic types */
          ...(item as any)
        };
        resolve(newItem);
      });
    });
    return promise;
  }


  update(item: T): Promise<T> {
    console.log(`[BaseService] updating item ${item.id}`);

    const promise = new Promise<T>((resolve, reject) => {
      const docRef = this.collection
        .doc<T>(item.id)
        .set(item)
        .then(() => {
          resolve({
            ...(item as any)
          });
        });
    });
    return promise;
  }

  delete(id: string): void {
    console.log(`[BaseService] deleting item ${id}`);

    const docRef = this.collection.doc<T>(id);
    docRef.delete();
  }

}
=======
import { IBaseService } from './IBaseService.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IBaseEntity } from '../entites/IBaseEntity.class';
export abstract class BaseService<T extends IBaseEntity> implements IBaseService<T> {

  protected collection: AngularFirestoreCollection<T>;
  protected dbpath;

  constructor(path: string, protected afs: AngularFirestore, orderBy?: string) {
    if (orderBy) {
      this.collection = this.afs.collection<T>(path, ref => ref.orderBy(orderBy));
    } else {
      this.collection = this.afs.collection<T>(path);
    }
    // alert(path);
    this.dbpath = path;
  }
  get(identifier: string): Observable<T> {
    console.log(`[BaseService] get: ${identifier}`);

    return this.collection
      .doc<T>(identifier)
      .snapshotChanges()
      .pipe(
        map(doc => {
          if (doc.payload.exists) {
            /* workaround until spread works with generic types */
            const data = doc.payload.data() as T;
            console.log('doc is ...', doc.payload.data());
            const id = doc.payload.id;
            return { id, ...data };
          }
        })
      );
  }


  list(): Observable<T[]> {
    console.log(`[BaseService] list`);
    return this.collection
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as T;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  findBy(key: string, value: any, orderby?: string) {
    if (orderby) {
      return this.afs.collection(this.dbpath, ref => ref.where(key, '==', value).orderBy(orderby));
    } else {
      return this.afs.collection(this.dbpath, ref => ref.where(key, '==', value));
    }
  }

  findByfilters(keys: string[], operator: firebase.firestore.WhereFilterOp[], values: any[], orderby?: string) {
    return this.afs.collection(this.dbpath, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      let i = 0;
      keys.forEach(s => {
        query = query.where(s, operator[i], values[i]);
        i++;
      });
      if (orderby) {
        return query.orderBy(orderby);
      }
      return query;
    });
  }

  add(item: T): Promise<T> {
    console.log('[BaseService] adding item', item);
    item.dateCreation = new Date();
    const promise = new Promise<T>((resolve, reject) => {
      this.collection.add(Object.assign({},item)).then(ref => {
        const newItem = {
          id: ref.id,

          /* workaround until spread works with generic types */
          ...(item as any)
        };
        resolve(newItem);
      });
    });
    return promise;
  }


  update(item: T): Promise<T> {
    console.log(`[BaseService] updating item ${item.id}`);

    const promise = new Promise<T>((resolve, reject) => {
      const docRef = this.collection
        .doc<T>(item.id)
        .set(Object.assign({},item))
        .then(() => {
          resolve({
            ...(item as any)
          });
        });
    });
    return promise;
  }

  delete(id: string): void {
    console.log(`[BaseService] deleting item ${id}`);

    const docRef = this.collection.doc<T>(id);
    docRef.delete();
  }

}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
