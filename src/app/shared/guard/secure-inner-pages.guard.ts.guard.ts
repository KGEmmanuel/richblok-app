import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

/**
 * Redirects already-authenticated users AWAY from auth pages (sign-in, register, forgot-password)
 * back to the feed. Lets logged-out users through.
 */
@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard  {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (user) {
          this.router.navigate(['/feed']);
          return false;
        }
        return true;
      })
    );
  }
}
