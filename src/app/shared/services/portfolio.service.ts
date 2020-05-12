import { Injectable } from '@angular/core';
import { Realisation } from '../entites/Realisation';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  path = 'realisations';
  basepath = 'utilisateurs';
  db = firebase.firestore();
  constructor() { }

  add(user, data: Realisation) {
    console.log('Real Media ', data.medias);
    return this.db.collection(this.basepath).doc(user).collection(this.path).add(Object.assign({}, data));
  }

  setmedia(user, id, meds) {
    return this.db.collection(this.basepath).doc(user).collection(this.path).doc(id).update({medias: meds});
  }

  getportfolios(user) {
    return this.db.collection(this.basepath).doc(user).collection(this.path);
  }

  delete(user, id) {
    return this.db.collection(this.basepath).doc(user).collection(this.path).doc(id).delete();
  }
}
