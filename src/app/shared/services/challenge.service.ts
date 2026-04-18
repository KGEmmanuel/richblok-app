import { Injectable, inject } from '@angular/core';
import { Challenge } from '../entites/Challenge';
import {
  Firestore, addDoc, collection, doc, query, updateDoc, where
} from '@angular/fire/firestore';
import { snapshotDoc, snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  readonly path = 'challenges';

  private firestore = inject(Firestore);

  constructor() { }

  challengesListOf(owner: string) {
    return snapshotQuery(
      query(collection(this.firestore, this.path), where('creatorRef', '==', owner))
    );
  }

  challengesListOfSkill(skill: string) {

  }

  save(job: Challenge) {
    job.dateCreation = new Date();
    return addDoc(collection(this.firestore, this.path), Object.assign({}, job));
  }
  update(job: Challenge) {
    return updateDoc(doc(this.firestore, this.path, job.id), Object.assign({}, job) as any);
  }
  getDocRef(id: string) {
    return snapshotDoc(doc(this.firestore, this.path, id));
  }
}
