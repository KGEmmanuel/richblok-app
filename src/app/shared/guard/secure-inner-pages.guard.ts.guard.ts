import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';

/**
 * Redirects already-authenticated users AWAY from auth pages (sign-in, register, forgot-password)
 * back to the feed. Lets logged-out users through.
 *
 * D7 Day 1 — migrated compat → modular (identical semantics).
 */
@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return authState(this.auth).pipe(
      take(1),
      map(user => {
        if (user) {
          // Week-1 IA: post-auth lands on /me (the unified hub).
          this.router.navigate(['/me']);
          return false;
        }
        return true;
      })
    );
  }
}
