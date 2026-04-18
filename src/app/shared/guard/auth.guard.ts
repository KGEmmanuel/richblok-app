import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  // D7 Day 1 — migrated compat → modular.
  // AngularFireAuth.authState (Observable<User|null>) → authState(auth)
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return authState(this.auth).pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }
        this.router.navigate(['/sign-in']);
        return false;
      })
    );
  }
}
