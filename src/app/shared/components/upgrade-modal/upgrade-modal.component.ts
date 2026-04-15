import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { AnalyticsService } from '../../services/analytics.service';

export type UpgradeTrigger = 'challenge_limit' | 'cv_export' | 'recruiter_visibility' | 'manual' | 'badge_share';

@Component({
  selector: 'app-upgrade-modal',
  templateUrl: './upgrade-modal.component.html',
  styleUrls: ['./upgrade-modal.component.scss']
})
export class UpgradeModalComponent implements OnInit, OnDestroy {

  @Input() open = false;
  @Input() trigger: UpgradeTrigger = 'manual';
  @Input() dismissibleAfterMs = 5000;
  @Output() closed = new EventEmitter<'dismissed' | 'upgraded'>();

  loading = false;
  canDismiss = false;
  annualBilling = false;

  private dismissTimer: any = null;

  private readonly triggerCopy: Record<UpgradeTrigger, { title: string; sub: string }> = {
    challenge_limit: {
      title: 'You’ve hit your free limit — unlock unlimited challenges',
      sub: 'Free users get 3 challenges/month. Pro users get unlimited — plus verified Pro badges and priority recruiter visibility.'
    },
    cv_export: {
      title: 'Export your CV — Pro members only',
      sub: 'Download a polished, recruiter-ready PDF CV with all your verified badges, experience and skills.'
    },
    recruiter_visibility: {
      title: 'Get seen by global recruiters',
      sub: 'Pro profiles are boosted in recruiter search. 3× more profile views on average.'
    },
    manual: {
      title: 'Go Pro — for less than 2 cups of coffee',
      sub: 'Unlimited challenges, verified Pro badge, recruiter visibility boost, CV export, and referral rewards.'
    },
    badge_share: {
      title: 'Stand out — upgrade to Pro',
      sub: 'Pro members show a verified Pro badge on every share. Recruiters trust Pro profiles 3× more.'
    }
  };

  readonly features = [
    'Unlimited skill challenges',
    'Verified Pro badge on every profile',
    '3× priority recruiter visibility',
    'Downloadable CV (PDF)',
    'Application tracking dashboard',
    'Referral rewards — 1 free month per friend',
    '30-day money-back guarantee'
  ];

  constructor(
    private subscription: SubscriptionService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    if (this.open) {
      this.onOpen();
    }
  }

  ngOnDestroy() {
    if (this.dismissTimer) { clearTimeout(this.dismissTimer); }
  }

  ngOnChanges() {
    if (this.open && !this.dismissTimer) {
      this.onOpen();
    }
  }

  private onOpen() {
    this.canDismiss = this.trigger === 'manual';
    this.analytics.track('ViewContent', { content_type: 'upgrade_modal', trigger: this.trigger });
    if (!this.canDismiss) {
      this.dismissTimer = setTimeout(() => { this.canDismiss = true; }, this.dismissibleAfterMs);
    }
  }

  get title(): string { return this.triggerCopy[this.trigger].title; }
  get sub(): string { return this.triggerCopy[this.trigger].sub; }
  get priceLabel(): string { return this.annualBilling ? '$7' : '$10'; }
  get pricePeriod(): string { return this.annualBilling ? '/mo · billed yearly ($84)' : '/month'; }

  dismiss() {
    if (!this.canDismiss) { return; }
    this.analytics.track('UpgradeModalDismiss', { trigger: this.trigger });
    this.closed.emit('dismissed');
  }

  upgrade() {
    this.loading = true;
    this.analytics.track('InitiateCheckout', {
      plan: this.annualBilling ? 'pro_annual' : 'pro_monthly',
      trigger: this.trigger,
      value: this.annualBilling ? 84 : 10,
      currency: 'USD'
    });
    try {
      this.subscription.startProSubscription();
      // The checkout session redirect is async; close modal anyway on next tick
      setTimeout(() => {
        this.loading = false;
        this.closed.emit('upgraded');
      }, 2000);
    } catch (err) {
      this.loading = false;
      console.error('Upgrade error:', err);
    }
  }
}
