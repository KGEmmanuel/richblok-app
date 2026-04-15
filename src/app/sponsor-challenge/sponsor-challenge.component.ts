import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AnalyticsService } from '../shared/services/analytics.service';
import { first } from 'rxjs/operators';

interface ChallengePick {
  id: string;
  titre: string;
  slug?: string;
  skills?: string[];
  competencyTags?: string[];
}

@Component({
  selector: 'app-sponsor-challenge',
  templateUrl: './sponsor-challenge.component.html',
  styleUrls: ['./sponsor-challenge.component.scss']
})
export class SponsorChallengeComponent implements OnInit {

  step: 'pick' | 'brand' | 'checkout' | 'error' = 'pick';
  loading = true;
  saving = false;

  challenges: ChallengePick[] = [];
  selected: ChallengePick | null = null;

  // Sponsorship branding
  sponsorName = '';
  sponsorLogoUrl = '';
  prizeDescription = '';
  contactEmail = '';
  errorMsg = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.analytics.pageView('sponsor_challenge');
    this.afs.collection<any>('challenges').snapshotChanges().pipe(first()).subscribe(snaps => {
      this.challenges = snaps.map(s => {
        const data: any = s.payload.doc.data();
        return {
          id: s.payload.doc.id,
          titre: data.titre,
          slug: data.slug,
          skills: data.skills,
          competencyTags: data.competencyTags
        };
      });
      this.loading = false;

      // If arrived with ?challenge=<id>, preselect + jump to brand step.
      const pre = this.route.snapshot.queryParamMap.get('challenge');
      if (pre) {
        const found = this.challenges.find(c => c.id === pre || c.slug === pre);
        if (found) { this.pick(found); }
      }
    });
  }

  pick(c: ChallengePick) {
    this.selected = c;
    this.step = 'brand';
    this.analytics.track('SponsorChallengeSelect', { challengeId: c.id, slug: c.slug });
  }

  async payAndSponsor() {
    if (!this.selected) { return; }
    if (!this.sponsorName || !this.contactEmail) {
      this.errorMsg = 'Sponsor name and contact email are required.';
      return;
    }
    this.saving = true;
    this.errorMsg = '';

    try {
      // Persist the sponsorship intent FIRST (so server-side webhook can
      // attach the Stripe session id on completion).
      await this.afs.collection('challenge_sponsorships').add({
        challengeId: this.selected.id,
        challengeTitle: this.selected.titre,
        sponsorName: this.sponsorName,
        sponsorLogoUrl: this.sponsorLogoUrl || null,
        prizeDescription: this.prizeDescription || null,
        contactEmail: this.contactEmail,
        status: 'awaiting_payment',
        createdAt: new Date()
      });

      this.analytics.track('InitiateCheckout', {
        content_type: 'sponsor_challenge',
        challengeId: this.selected.id,
        value: 700,
        currency: 'USD'
      });

      const resp: any = await this.http.post('/api/stripe/checkout', {
        kind: 'sponsor_challenge',
        challengeId: this.selected.id,
        sponsorName: this.sponsorName,
        successUrl: window.location.origin + '/sponsor?paid=1&challenge=' + this.selected.id,
        cancelUrl: window.location.origin + '/sponsor?cancel=1'
      }).toPromise();
      if (resp && resp.url) {
        window.location.href = resp.url;
      } else {
        throw new Error(resp && resp.error ? resp.error : 'Checkout failed');
      }
    } catch (err) {
      const e: any = err;
      this.saving = false;
      this.errorMsg = (e && e.error && e.error.error) || (e && e.message) || 'Could not start checkout. Please try again.';
      this.step = 'error';
    }
  }

  reset() {
    this.step = 'pick';
    this.selected = null;
    this.errorMsg = '';
  }
}
