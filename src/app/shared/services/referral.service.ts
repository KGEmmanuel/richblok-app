import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { Referral, ReferralStats } from '../entites/Referral';

// D7 Day 1 — modular Firebase migration. Public API preserved.
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  getDocs,
  updateDoc,
  query as fsQuery,
  where,
  limit,
  serverTimestamp
} from '@angular/fire/firestore';
// Functions SDK is still invoked directly (not via @angular/fire) because
// this codebase never wrapped it in a provider.
import { getFunctions, httpsCallable } from 'firebase/functions';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  private auth      = inject(Auth);
  private firestore = inject(Firestore);

  /**
   * Generates or fetches the user's unique invite code (6 chars, base36 from uid).
   */
  getInviteCode(uid: string): string {
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
      hash = ((hash << 5) - hash) + uid.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36).substring(0, 6).toUpperCase().padEnd(6, 'X');
  }

  getInviteUrl(uid: string): string {
    const code = this.getInviteCode(uid);
    return `${window.location.origin}/register?ref=${code}`;
  }

  async sendInvite(referredEmail: string): Promise<void> {
    const user = await authState(this.auth).pipe(first()).toPromise();
    if (!user) { throw new Error('Must be logged in to invite'); }

    const referral: Referral = {
      referrerUid: user.uid,
      referrerEmail: user.email,
      referredEmail,
      status: 'pending',
      createdAt: serverTimestamp() as any,
      inviteCode: this.getInviteCode(user.uid)
    };

    await addDoc(collection(this.firestore, 'referrals'), referral as any);

    // Trigger email via Cloud Function. Failure non-fatal — referral still saved.
    try {
      const functions = getFunctions();
      const callable = httpsCallable(functions, 'sendInviteEmail');
      await callable({ to: referredEmail, inviteCode: referral.inviteCode });
    } catch (e) {
      console.warn('Invite email send skipped:', e);
    }
  }

  getStats(uid: string): Observable<ReferralStats> {
    const q = fsQuery(
      collection(this.firestore, 'referrals'),
      where('referrerUid', '==', uid)
    );
    return (collectionData(q) as Observable<Referral[]>).pipe(
      map(refs => {
        const signedUp = refs.filter(r => r.status === 'signed_up' || r.status === 'subscribed' || r.status === 'rewarded').length;
        const subscribed = refs.filter(r => r.status === 'subscribed' || r.status === 'rewarded').length;
        const freeMonthsEarned = refs.filter(r => r.status === 'rewarded').length;
        return { totalSent: refs.length, signedUp, subscribed, freeMonthsEarned };
      })
    );
  }

  async claimReferral(inviteCode: string, newUserUid: string, newUserEmail: string): Promise<void> {
    const q = fsQuery(
      collection(this.firestore, 'referrals'),
      where('inviteCode', '==', inviteCode),
      where('referredEmail', '==', newUserEmail),
      where('status', '==', 'pending'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      await updateDoc(docRef, {
        referredUid: newUserUid,
        status: 'signed_up',
        signedUpAt: serverTimestamp()
      });
    }
  }
}
