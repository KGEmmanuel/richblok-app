import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Demonstration } from '../entites/demonstration';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class DemonstrateService {
  readonly path = 'demonstrations';
  readonly basepath = 'utilisateurs';

  private firestore = inject(Firestore);

  constructor() { }

  private col(user: string) {
    return collection(this.firestore, this.basepath, user, this.path);
  }

  add(user: string, data: Demonstration) {
    console.log(data.medias);
    const medias = [];
    data.demDate = new Date();
    if (data.medias) {
      data.medias.forEach(v => {
        medias.push(Object.assign({}, v));
      });
      data.medias = medias;
    }
    return addDoc(this.col(user), Object.assign({}, data));
  }

  get(user: string) {
    return snapshotQuery(this.col(user));
  }

}
