import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../shared/services/subscription.service';
import { AnalyticsService } from '../shared/services/analytics.service';
import { UpgradeTrigger } from '../shared/components/upgrade-modal/upgrade-modal.component';

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
