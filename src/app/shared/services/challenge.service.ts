import { Injectable } from '@angular/core';
import { Challenge } from '../entites/Challenge';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  readonly path = 'challenges';
  db = firebase.firestore();

  constructor() { }

  challengesListOf(owner: string) {
    return this.db.collection(this.path).where('creatorRef', '==', owner);
  }

  challengesListOfSkill(skill: string) {

  }

  save(job: Challenge) {
    job.dateCreation = new Date();
    return this.db.collection(this.path).add(Object.assign({}, job));
  }
  update(job: Challenge){
    return this.db.collection(this.path).doc(job.id).update(Object.assign({},job));
  }
  getDocRef(id) {
    return this.db.collection(this.path).doc(id);
  }
}
