import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Demonstration } from '../entites/demonstration';

@Injectable({
  providedIn: 'root'
})
export class DemonstrateService {
  readonly path = 'demonstrations';
  readonly basepath = 'utilisateurs';
  db = firebase.firestore();
  constructor() { }

  add(user: string, data: Demonstration ) {
    const chem = this.path;
    console.log(data.medias);
    const medias = [];
    data.demDate = new Date();
    if (data.medias) {
      data.medias.forEach(v => {
        medias.push(Object.assign({}, v));
      });
      // medias.push()
      data.medias = medias;
    }
    return this.db.collection(this.basepath).doc(user).collection(this.path).add(Object.assign({}, data));
  }

<<<<<<< HEAD
=======
  get(user:string){
    return this.db.collection(this.basepath).doc(user).collection(this.path);
  }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

}
