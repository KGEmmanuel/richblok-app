import { Injectable, inject } from '@angular/core';
import {
  Firestore, addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc, where
} from '@angular/fire/firestore';
import { Formation } from '../entites/Formation';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  readonly path = 'formations';
  readonly basePaht = 'utilisateurs';

  private firestore = inject(Firestore);

  constructor() { }

  private col(userid: string) {
    return collection(this.firestore, this.basePaht, userid, this.path);
  }

  editableFormationsListQuery(userid: string, typeFormations?: string) {
    const c = this.col(userid);
    const q = typeFormations
      ? query(c, where('typeFormation', '==', typeFormations), orderBy('datedeb', 'desc'))
      : query(c, orderBy('datedeb', 'desc'));
    return snapshotQuery(q);
  }

  save(f: Formation, userid: string) {
    return addDoc(this.col(userid), Object.assign({}, f));
  }

  update(userid: string, fid: string, itm: Partial<Formation>) {
    return updateDoc(doc(this.firestore, this.basePaht, userid, this.path, fid), itm as any);
  }

  delete(userid: string, formationId: string) {
    return deleteDoc(doc(this.firestore, this.basePaht, userid, this.path, formationId));
  }

}
