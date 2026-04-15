import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SubscriptionService } from '../services/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.subscriptionService.tier$.pipe(
      take(1),
      map(tier => {
        if (tier === 'pro' || tier === 'team') {
          return true;
        }
        const feature = route.queryParams['feature'] || 'premium';
        this.router.navigate(['/landing'], { queryParams: { upgrade: true, feature } });
        return false;
      })
    );
  }
}
