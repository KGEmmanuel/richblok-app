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

  delete(userid: string, id: string){
    return  this.db.collection(this.basepath).doc(userid).collection(this.path).doc(id).delete();
  }
  update(user, data: Realisation){
    return this.db.collection(this.basepath).doc(user).collection(this.path).doc(data.id).update(Object.assign({},data));
  }
}
