import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { SubscriptionTier, SubscriptionStatus } from '../entites/Subscription';
import { AnalyticsService } from './analytics.service';

// D7 Day 1 — modular Firebase.
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  collection,
  addDoc,
  getDocs,
  query as fsQuery,
  where
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private tierSubject = new BehaviorSubject<SubscriptionTier>('free');
  tier$: Observable<SubscriptionTier> = this.tierSubject.asObservable();

  private statusSubject = new BehaviorSubject<SubscriptionStatus>('free');
  status$: Observable<SubscriptionStatus> = this.statusSubject.asObservable();

  private auth      = inject(Auth);
  private firestore = inject(Firestore);

  constructor(
    private http: HttpClient,
    private analytics: AnalyticsService
  ) {
    this.initSubscriptionListener();
  }

  private initSubscriptionListener() {
    let previousTier: SubscriptionTier | null = null;
    authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          return (docData(doc(this.firestore, 'utilisateurs', user.uid)) as Observable<any>).pipe(
            map(userData => ({
              tier: (userData && userData.subscription_tier as SubscriptionTier) || 'free',
              status: (userData && userData.subscription_status as SubscriptionStatus) || 'free'
            }))
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

  async startProSubscription(): Promise<void> {
    const user = await authState(this.auth).pipe(first()).toPromise();
    if (!user) {
      throw new Error('User must be logged in to subscribe');
    }
    const resp: any = await this.http.post('/api/stripe/checkout', {
      kind: 'pro_subscription',
      uid: user.uid,
      successUrl: window.location.origin + '/me?tab=feed&subscription=success',
      cancelUrl: window.location.origin + '/me?tab=feed&subscription=cancelled'
    }).toPromise();

    if (resp && resp.url) {
      window.location.href = resp.url;
    } else {
      throw new Error(resp && resp.error ? resp.error : 'Failed to create checkout session');
    }
  }

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

  async openBillingPortal(): Promise<void> {
    const user = await authState(this.auth).pipe(first()).toPromise();
    if (!user) { throw new Error('User must be logged in'); }
    const userDoc: any = await (docData(doc(this.firestore, 'utilisateurs', user.uid)) as Observable<any>).pipe(first()).toPromise();
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
    return authState(this.auth).pipe(
      first(),
      switchMap(user => {
        if (!user) { return of(false); }
        if (this.isPro) { return of(true); }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const q = fsQuery(
          collection(this.firestore, 'challenge_submissions'),
          where('uid', '==', user.uid),
          where('submitted_at', '>=', startOfMonth)
        );
        return new Observable<boolean>(sub => {
          getDocs(q).then(snap => {
            sub.next(snap.size < 3);
            sub.complete();
          }).catch(() => {
            sub.next(false);
            sub.complete();
          });
        });
      })
    );
  }

  async recordChallengeSubmission(challengeId: string): Promise<void> {
    const user = await authState(this.auth).pipe(first()).toPromise();
    if (!user) { return; }
    await addDoc(collection(this.firestore, 'challenge_submissions'), {
      uid: user.uid,
      challengeId,
      submitted_at: new Date()
    });
  }
}
