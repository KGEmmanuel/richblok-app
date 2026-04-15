import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { SubscriptionTier, SubscriptionStatus } from '../entites/Subscription';
import { AnalyticsService } from './analytics.service';
import * as firebase from 'firebase/app';
import 'firebase/functions';

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
    private afAuth: AngularFireAuth,
    private analytics: AnalyticsService
  ) {
    this.initSubscriptionListener();
  }

  private initSubscriptionListener() {
    let previousTier: SubscriptionTier | null = null;
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
      // Fire Purchase event on free → pro transition
      if (previousTier === 'free' && (sub.tier === 'pro' || sub.tier === 'team')) {
        this.analytics.track('Purchase', {
          value: sub.tier === 'team' ? 49 : 10,
          currency: 'USD',
          content_type: 'subscription',
          content_name: sub.tier === 'team' ? 'pro_team' : 'pro_monthly'
        });
        this.analytics.track('Subscribe', { tier: sub.tier });
      }
      previousTier = sub.tier;
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

  /**
   * Calls the createCheckoutSession Cloud Function and redirects to Stripe Checkout.
   */
  async startProSubscription(): Promise<void> {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) {
      throw new Error('User must be logged in to subscribe');
    }

    const callable = firebase.functions().httpsCallable('createCheckoutSession');
    const result: any = await callable({
      successUrl: window.location.origin + '/profile?subscription=success',
      cancelUrl: window.location.origin + '/profile?subscription=cancelled'
    });

    if (result.data && result.data.url) {
      window.location.href = result.data.url;
    } else {
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Opens the Stripe Customer Portal for self-service billing management.
   */
  async openBillingPortal(): Promise<void> {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) {
      throw new Error('User must be logged in');
    }

    const callable = firebase.functions().httpsCallable('createPortalSession');
    const result: any = await callable({
      returnUrl: window.location.origin + '/settings'
    });

    if (result.data && result.data.url) {
      window.location.href = result.data.url;
    }
  }

  /**
   * Checks if a free user has remaining challenge submissions this month (limit 3).
   * Pro users always return true.
   */
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

  /**
   * Records a challenge submission via Cloud Function (server-side counter).
   */
  async recordChallengeSubmission(challengeId: string): Promise<void> {
    const callable = firebase.functions().httpsCallable('recordChallengeSubmission');
    await callable({ challengeId });
  }
}
