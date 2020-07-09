import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Formation } from '../entites/Formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  readonly path = 'formations';
  readonly basePaht = 'utilisateurs';
  db = firebase.firestore();
  constructor() { }

  editableFormationsListQuery(userid: string, typeFormations?: string) {
    if(typeFormations){
    return this.db.collection(this.basePaht + '/' + userid + '/' + this.path)
      .where('typeFormation', '==', typeFormations)
      .orderBy('datedeb', 'desc');
    }
    return this.db.collection(this.basePaht + '/' + userid + '/' + this.path)
      .orderBy('datedeb', 'desc');
  }

  save(f: Formation, userid: string) {
     return this.db.collection(this.basePaht + '/' + userid + '/' + this.path).add(Object.assign({}, f));
  }

  update(userid: string, fid: string, itm: Partial<Formation>) {
    return this.db.collection(this.basePaht + '/' + userid + '/' + this.path).doc(fid).update(itm);
  }

  delete(userid: string, formationId: string){
    return  this.db.collection(this.basePaht).doc(userid).collection(this.path).doc(formationId).delete();
  }

}
