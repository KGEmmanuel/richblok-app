import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { Referral, ReferralStats } from '../entites/Referral';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  /**
   * Generates or fetches the user's unique invite code (6 chars, base36 from uid).
   */
  getInviteCode(uid: string): string {
    // Deterministic 6-char code from uid (no DB roundtrip needed)
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
      hash = ((hash << 5) - hash) + uid.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36).substring(0, 6).toUpperCase().padEnd(6, 'X');
  }

  /**
   * Builds the shareable invite URL.
   */
  getInviteUrl(uid: string): string {
    const code = this.getInviteCode(uid);
    return `${window.location.origin}/register?ref=${code}`;
  }

  /**
   * Creates a referral record when a user invites someone via email.
   */
  async sendInvite(referredEmail: string): Promise<void> {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) { throw new Error('Must be logged in to invite'); }

    const referral: Referral = {
      referrerUid: user.uid,
      referrerEmail: user.email,
      referredEmail,
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      inviteCode: this.getInviteCode(user.uid)
    };

    await this.afs.collection('referrals').add(referral);

    // Trigger email via Cloud Function (sendInviteEmail to be added)
    try {
      const callable = (firebase as any).functions().httpsCallable('sendInviteEmail');
      await callable({ to: referredEmail, inviteCode: referral.inviteCode });
    } catch (e) {
      // Email service not yet wired — referral still saved
      console.warn('Invite email send skipped:', e);
    }
  }

  /**
   * Returns the user's referral statistics for the dashboard.
   */
  getStats(uid: string): Observable<ReferralStats> {
    return this.afs.collection<Referral>('referrals', ref => ref.where('referrerUid', '==', uid))
      .valueChanges()
      .pipe(
        map(refs => {
          const signedUp = refs.filter(r => r.status === 'signed_up' || r.status === 'subscribed' || r.status === 'rewarded').length;
          const subscribed = refs.filter(r => r.status === 'subscribed' || r.status === 'rewarded').length;
          const freeMonthsEarned = refs.filter(r => r.status === 'rewarded').length;
          return {
            totalSent: refs.length,
            signedUp,
            subscribed,
            freeMonthsEarned
          };
        })
      );
  }

  /**
   * Called on signup to claim a referral code (links the new user to the referrer).
   */
  async claimReferral(inviteCode: string, newUserUid: string, newUserEmail: string): Promise<void> {
    const matches = await this.afs.collection<Referral>('referrals', ref =>
      ref.where('inviteCode', '==', inviteCode)
         .where('referredEmail', '==', newUserEmail)
         .where('status', '==', 'pending')
         .limit(1)
    ).get().toPromise();

    if (matches && !matches.empty) {
      const docRef = matches.docs[0].ref;
      await docRef.update({
        referredUid: newUserUid,
        status: 'signed_up',
        signedUpAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }
}
