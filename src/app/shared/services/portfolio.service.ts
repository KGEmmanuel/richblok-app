import { Injectable, inject } from '@angular/core';
import { Realisation } from '../entites/Realisation';
import {
  Firestore, addDoc, collection, deleteDoc, doc, updateDoc
} from '@angular/fire/firestore';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  path = 'realisations';
  basepath = 'utilisateurs';

  private firestore = inject(Firestore);

  constructor() { }

  private col(user: string) {
    return collection(this.firestore, this.basepath, user, this.path);
  }

  add(user: string, data: Realisation) {
    console.log('Real Media ', data.medias);
    return addDoc(this.col(user), Object.assign({}, data));
  }

  setmedia(user: string, id: string, meds: any) {
    return updateDoc(
      doc(this.firestore, this.basepath, user, this.path, id),
      { medias: meds }
    );
  }

  getportfolios(user: string) {
    return snapshotQuery(this.col(user));
  }

  delete(userid: string, id: string) {
    return deleteDoc(doc(this.firestore, this.basepath, userid, this.path, id));
  }

  update(user: string, data: Realisation) {
    return updateDoc(
      doc(this.firestore, this.basepath, user, this.path, data.id),
      Object.assign({}, data) as any
    );
  }
}
