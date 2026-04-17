import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../shared/services/subscription.service';
import { AnalyticsService } from '../shared/services/analytics.service';
import { UpgradeTrigger } from '../shared/components/upgrade-modal/upgrade-modal.component';

/**
 * Challenges list page — V5 migration.
 *
 * Before: Bootstrap 3-column grid (left sidebar + center list + right sidebar),
 * app-header / app-footer per-page, broken "Find a challenge" search form.
 *
 * After: rb-app-shell chrome + V5 hero + <app-evaluate-list> for the actual
 * list. Sidebars dropped — they were low-value and created mobile friction.
 * The upgrade-modal is preserved so the challenge-limit upsell still fires.
 *
 * rb-app-shell + V5 primitives live in AppModule.imports so this
 * NgModule-declared component can use them without converting to standalone
 * (EvaluateListComponent and UpgradeModalComponent aren't standalone yet;
 * converting is its own follow-up task).
 */
@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements OnInit {

  upgradeOpen = false;
  upgradeTrigger: UpgradeTrigger = 'manual';

  constructor(
    private title: Title,
    private meta: Meta,
    private subscription: SubscriptionService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.title.setTitle('RichBlok | Challenges');
    this.meta.updateTag({ name: 'description', content: 'Take a skill challenge and earn a verified badge on RichBlok.' });
    this.analytics.pageView('evaluate');
  }

  checkLimitAndPrompt() {
    this.subscription.checkChallengeLimit().subscribe(canTake => {
      if (!canTake) {
        this.upgradeTrigger = 'challenge_limit';
        this.upgradeOpen = true;
      }
    });
  }

  onUpgradeClosed() {
    this.upgradeOpen = false;
  }
}
