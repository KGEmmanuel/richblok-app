import { Injectable, inject } from '@angular/core';
import { Experience } from '../entites/Experience';
import {
  Firestore, addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc
} from '@angular/fire/firestore';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  readonly basePath = 'utilisateurs';
  readonly path = 'experiences';

  private firestore = inject(Firestore);

  constructor() { }

  private col(user: string) {
    return collection(this.firestore, this.basePath, user, this.path);
  }

  listExperiences(user: string) {
    return snapshotQuery(query(this.col(user), orderBy('debut', 'desc')));
  }

  delete(user: string, dataId: string) {
    return deleteDoc(doc(this.firestore, this.basePath, user, this.path, dataId));
  }

  save(user: string, data: Experience) {
    return addDoc(this.col(user), Object.assign({}, data));
  }

  update(user: string, data: Experience) {
    return updateDoc(
      doc(this.firestore, this.basePath, user, this.path, data.id),
      Object.assign({}, data) as any
    );
  }
}
