import { Injectable } from '@angular/core';
import { Experience } from '../entites/Experience';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  readonly basePath = 'utilisateurs';
  readonly path = 'experiences';
  private db = firebase.firestore();
  constructor() { }

  listExperiences(user: string) {
    return this.db.collection(this.basePath).doc(user).collection(this.path).orderBy('debut', 'desc');
  }

  delete(user: string, dataId: string){
    return this.db.collection(this.basePath).doc(user).collection(this.path).doc(dataId).delete();
  };

  save(user, data: Experience){
    return this.db.collection(this.basePath).doc(user).collection(this.path).add(Object.assign({},data));
  }

  update(user, data: Experience){
    return this.db.collection(this.basePath).doc(user).collection(this.path).doc(data.id).update(Object.assign({},data));
  }
}
