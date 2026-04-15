import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubscriptionService } from '../services/subscription.service';

@Directive({
  selector: '[requiresPro]'
})
export class RequiresProDirective implements OnInit, OnDestroy {

  private subscription: Subscription;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.subscription = this.subscriptionService.tier$.subscribe(tier => {
      const isPro = tier === 'pro' || tier === 'team';
      if (isPro && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!isPro && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
