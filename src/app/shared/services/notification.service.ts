import { Injectable, inject } from '@angular/core';
import { Firestore, collection, orderBy, query, where } from '@angular/fire/firestore';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly path = 'notifications';

  private firestore = inject(Firestore);

  constructor() {
  }

  getNotifRef(userid: string) {
    return snapshotQuery(
      query(
        collection(this.firestore, this.path),
        where('abonnees', 'array-contains', userid),
        orderBy('date', 'desc')
      )
    );
  }

}
