import { Injectable } from '@angular/core';
import { Challenge } from '../entites/Challenge';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ChalengeService {

  readonly path = 'challenges';

  db = firebase.firestore();

  constructor() { }

  chalengesListOf(owner: string) {
    return this.db.collection(this.path).where('creatorRef', '==', owner);
  }

  chalengesListOfSkill(skill: string) {

  }

  save(job: Challenge, orgid: string) {
    return this.db.collection(this.path).add(Object.assign({}, job));
  }
}
