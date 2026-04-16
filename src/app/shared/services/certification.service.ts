import { Injectable } from '@angular/core';
import { Certification } from '../entites/Certification';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {

  readonly basePath = 'utilisateurs';
  readonly invitPath = 'certInvitations';
  readonly trainPath = '';
  readonly skillPath = '';
   db = firebase.firestore();
  constructor() { }

  inviteToCertify(cert: Certification) {
    return this.db.collection(this.invitPath).add(Object.assign({}, {...cert, datedemande : new Date() }));
  }

  certify(cert: Certification) {

  }

}
