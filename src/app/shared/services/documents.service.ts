import { Injectable, inject } from '@angular/core';
import {
  Firestore, addDoc, collection, deleteDoc, doc, query, updateDoc, where
} from '@angular/fire/firestore';
import { Document } from '../entites/Document';
import { snapshotQuery } from './firestore-compat-shim';


@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  readonly path = 'documents';
  readonly basepath = 'utilisateurs';

  private firestore = inject(Firestore);

  constructor() { }

  private col(user: string) {
    return collection(this.firestore, this.basepath, user, this.path);
  }

  add(user: string, data: Document) {
    console.log('media   ', data);
    data.documentUploadDate = new Date();
    console.log('merde alors...', data.medias);
    return addDoc(this.col(user), Object.assign({}, data));
  }

  setmedias(user: string, id: string, media: any[]) {
    console.log('updating alors...', media, user, id);
    const v = [];
    media.forEach(med => {
      v.push(Object.assign({}, med));
    });
    console.log('updating alors...', v, user, id);
    return updateDoc(doc(this.firestore, this.basepath, user, this.path, id), {
      medias: v
    });
  }

  listdocuments(user: string, doctype: string) {
    console.log('type  = ', doctype);
    return snapshotQuery(
      query(this.col(user), where('documenttype', '==', doctype))
    );
  }

  delete(user: string, id: string) {
    return deleteDoc(doc(this.firestore, this.basepath, user, this.path, id));
  }

}
