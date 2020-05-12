import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly path = 'notifications';
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();
  }

  getNotifRef(userid: string) {
    return this.db.collection(this.path).where('abonnees', 'array-contains', userid).orderBy('date', 'desc');
  }

}
