import { Injectable, inject } from "@angular/core";
import {
  Firestore, addDoc, collection, doc, query, updateDoc, where
} from '@angular/fire/firestore';
import { Entreprise } from "../entites/Entreprise";
import { snapshotDoc, snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: "root"
})
export class OrganisationService {
  readonly path = 'organisations';
  readonly postePath = 'postes';
  readonly commentPath = 'commentaires';

  private firestore = inject(Firestore);

  constructor() {
  }

  save(organisation: any) {
    return addDoc(collection(this.firestore, this.path), Object.assign({}, organisation));
  }

  getDocRef(id: string) {
    return snapshotDoc(doc(this.firestore, this.path, id));
  }

  getorganisationsof(user: string) {
    return snapshotQuery(
      query(collection(this.firestore, this.path), where('utilisateurId', '==', user))
    );
  }


  getorganisations() {
    return snapshotQuery(collection(this.firestore, this.path));
  }

  update(id: string, data: Partial<Entreprise>) {
    return updateDoc(doc(this.firestore, this.path, id), data as any);
  }

  getPostes(orgId: string, actual?: boolean, start?: any, end?: any) {
    return snapshotQuery(collection(this.firestore, this.path, orgId, this.postePath));
  }

  addPoste(orgid: string, poste: any) {
    return addDoc(
      collection(this.firestore, this.path, orgid, this.postePath),
      Object.assign({}, poste)
    );
  }

}
