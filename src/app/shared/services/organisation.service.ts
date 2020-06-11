import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { Entreprise } from "../entites/Entreprise";

@Injectable({
  providedIn: "root"
})
export class OrganisationService {
  db: firebase.firestore.Firestore;
  readonly path = 'organisations';
  readonly postePath = 'postes';
  readonly commentPath = 'commentaires';
  constructor() {
    this.db = firebase.firestore();
  }

  save(organisation) {
    const chem = this.path;
    return this.db.collection(chem).add(Object.assign({}, organisation));
  }

  getDocRef(id) {
    return this.db.collection(this.path).doc(id);
  }

  getorganisationsof(user) {
    return this.db.collection(this.path).where('utilisateurId', '==', user);
  }


  getorganisations() {
    return this.db.collection(this.path);
  }

  update(id: string, data: Partial<Entreprise>) {
    return this.db
      .collection(this.path)
      .doc(id)
      .update(data);
  }

  getPostes(orgId, actual?: boolean, start?, end?) {

    return this.db.collection(this.path).doc(orgId).collection(this.postePath);
  }

  addPoste(orgid, poste) {
    const chem = this.path + '/' + orgid + '/' + this.postePath;
    return this.db.collection(chem).add(Object.assign({}, poste));
  }

}
