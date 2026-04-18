import { Injectable, inject } from '@angular/core';
import { Certification } from '../entites/Certification';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {

  readonly basePath = 'utilisateurs';
  readonly invitPath = 'certInvitations';
  readonly trainPath = '';
  readonly skillPath = '';

  private firestore = inject(Firestore);

  constructor() { }

  inviteToCertify(cert: Certification) {
    return addDoc(
      collection(this.firestore, this.invitPath),
      Object.assign({}, { ...cert, datedemande: new Date() })
    );
  }

  certify(cert: Certification) {

  }

}
