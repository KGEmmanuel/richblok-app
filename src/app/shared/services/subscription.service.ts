import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { SubscriptionTier, SubscriptionStatus } from '../entites/Subscription';
import { AnalyticsService } from './analytics.service';

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
    private http: HttpClient,
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
   * Calls /api/stripe/checkout and redirects to Stripe Checkout.
   * Server uses STRIPE_SECRET_KEY + STRIPE_PRICE_PRO_MONTHLY; webhook updates
   * the user's subscription_tier when the session completes.
   */
  async startProSubscription(): Promise<void> {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) {
      throw new Error('User must be logged in to subscribe');
    }
    const resp: any = await this.http.post('/api/stripe/checkout', {
      kind: 'pro_subscription',
      uid: user.uid,
      successUrl: window.location.origin + '/profile?subscription=success',
      cancelUrl: window.location.origin + '/profile?subscription=cancelled'
    }).toPromise();

    if (resp && resp.url) {
      window.location.href = resp.url;
    } else {
      throw new Error(resp && resp.error ? resp.error : 'Failed to create checkout session');
    }
  }

  /**
   * Creates a Stripe Employer License checkout (B2B). tier = 'starter' ($500/yr)
   * or 'pro' ($1500/yr). Webhook updates employers/{employerId}/license_status.
   */
  async startEmployerLicense(employerId: string, tier: 'starter' | 'pro' = 'starter'): Promise<void> {
    const resp: any = await this.http.post('/api/stripe/checkout', {
      kind: 'employer_license',
      employerId,
      tier,
      successUrl: window.location.origin + '/employer/dashboard?license=active',
      cancelUrl: window.location.origin + '/employer/dashboard?license=cancel'
    }).toPromise();
    if (resp && resp.url) {
      window.location.href = resp.url;
    } else {
      throw new Error(resp && resp.error ? resp.error : 'Failed to start employer license');
    }
  }

  /**
   * Opens the Stripe Customer Portal. Requires the user's stripe_customer_id
   * to be persisted via the webhook handler.
   */
  async openBillingPortal(): Promise<void> {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) { throw new Error('User must be logged in'); }
    const userDoc: any = await this.afs.doc(`utilisateurs/${user.uid}`).valueChanges().pipe(first()).toPromise();
    const customerId = userDoc && userDoc.stripe_customer_id;
    if (!customerId) {
      throw new Error('No Stripe customer on file yet — subscribe first.');
    }
    const resp: any = await this.http.post('/api/stripe/portal', {
      customerId,
      returnUrl: window.location.origin + '/settings'
    }).toPromise();
    if (resp && resp.url) {
      window.location.href = resp.url;
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
   * Records a challenge submission directly to Firestore (server-side
   * monthly counter will be enforced once Firestore rules are tightened).
   */
  async recordChallengeSubmission(challengeId: string): Promise<void> {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) { return; }
    await this.afs.collection('challenge_submissions').add({
      uid: user.uid,
      challengeId,
      submitted_at: new Date()
    });
  }
}
