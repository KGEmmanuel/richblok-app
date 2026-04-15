import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { SubscriptionTier, SubscriptionStatus } from '../entites/Subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private tierSubject = new BehaviorSubject<SubscriptionTier>('free');
  tier$: Observable<SubscriptionTier> = this.tierSubject.asObservable();

  private statusSubject = new BehaviorSubject<SubscriptionStatus>('free');
  status$: Observable<SubscriptionStatus> = this.statusSubject.asObservable();

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.initSubscriptionListener();
  }

  private initSubscriptionListener() {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc(`utilisateurs/${user.uid}`).valueChanges().pipe(
            map((userData: any) => {
              return {
                tier: (userData && userData.subscription_tier as SubscriptionTier) || 'free',
                status: (userData && userData.subscription_status as SubscriptionStatus) || 'free'
              };
            })
          );
        }
        return of({ tier: 'free' as SubscriptionTier, status: 'free' as SubscriptionStatus });
      })
    ).subscribe(sub => {
      this.tierSubject.next(sub.tier);
      this.statusSubject.next(sub.status);
    });
  }

  get currentTier(): SubscriptionTier {
    return this.tierSubject.value;
  }

  get isPro(): boolean {
    return this.tierSubject.value === 'pro' || this.tierSubject.value === 'team';
  }

  startProSubscription(): void {
    this.afAuth.authState.pipe(first()).subscribe(user => {
      if (!user) {
        console.error('User must be logged in to subscribe');
        return;
      }

      // Create a Stripe Checkout session via Firestore trigger
      this.afs.collection('stripe_checkout_sessions').add({
        uid: user.uid,
        price: 'price_pro_monthly',
        success_url: window.location.origin + '/profile?subscription=success',
        cancel_url: window.location.origin + '/profile?subscription=cancelled',
      });
    });
  }

  openBillingPortal(): void {
    this.afAuth.authState.pipe(first()).subscribe(user => {
      if (!user) {
        console.error('User must be logged in');
        return;
      }
      console.log('Stripe billing portal session creation initiated');
    });
  }

  checkChallengeLimit(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      first(),
      switchMap(user => {
        if (!user) { return of(false); }
        if (this.isPro) { return of(true); }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return this.afs.collection('challenge_submissions', ref =>
          ref.where('uid', '==', user.uid)
             .where('submitted_at', '>=', startOfMonth)
        ).get().pipe(
          map(snapshot => (snapshot ? snapshot.size : 0) < 3)
        );
      })
    );
  }
}
