import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Document } from '../entites/Document';


@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  readonly path = 'documents';
  readonly basepath = 'utilisateurs';
  db = firebase.firestore();
  constructor() { }

  add(user: string, data: Document) {
    const chem = this.path;
    console.log('media   ', data);
    /*
    const medias = [];
    data.documentUploadDate = new Date();
    if (data.medias) {
      console.log('media is set ');
      data.medias.forEach(v => {
        console.log('assigned ', Object.assign({}, v));
        medias.push(Object.assign({}, v));
      });
      // medias.push ()
      data.medias = medias;
    }*/
    data.documentUploadDate = new Date();
    console.log('merde alors...', data.medias);
    return this.db.collection(this.basepath).doc(user).collection(this.path).add(Object.assign({}, data));
  }

  setmedias(user, id, media) {
    console.log('updating alors...', media, user, id);
    const v = [];
    media.forEach(med => {
      v.push(Object.assign({}, med));
    });
    console.log('updating alors...', v, user, id);
    return this.db.collection(this.basepath).doc(user).collection(this.path).doc(id).update({
      medias: v
    });
  }

  listdocuments(user, doctype) {
    console.log('type  = ', doctype);
    return this.db.collection(this.basepath).doc(user).collection(this.path).where('documenttype', '==', doctype);
  }

  delete(user, id){
    return this.db.collection(this.basepath).doc(user).collection(this.path).doc(id).delete();
  }

}
