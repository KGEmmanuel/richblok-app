import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { OffresEmploi } from '../entites/OffresEmploi';

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {

  readonly path = 'jobsoffer';

  db = firebase.firestore();

  constructor() { }

  offresListOfOrganisationRef(organisationref: string, statut?: string, typeOffre?: string) {
    if (statut) {
      return this.db.collection(this.path).where('organisationRef', '==', organisationref)
        .where('statut', '==', statut)
        .orderBy('datefin');
    }
    if (statut && typeOffre) {
      return this.db.collection(this.path).where('organisationRef', '==', organisationref)
        .where('statut', '==', statut)
        .where('jobType', '==', typeOffre)
        .orderBy('datefin');
    }
    console.log('getting ALL');
    return this.db.collection(this.path).where('organisationRef', '==', organisationref)
      .orderBy('datefin');
  }

  save(job: OffresEmploi, orgid: string) {
    return this.db.collection(this.path).add(Object.assign({}, job));
  }
/*
  update(userid: string, fid: string, itm: Partial<Formation>) {
    return this.db.collection(this.basePaht + '/' + userid + '/' + this.path).doc(fid).update(itm);
  }*/

}
