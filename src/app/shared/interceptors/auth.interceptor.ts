import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach tokens for our own Cloud Functions calls.
    // Do NOT match googleapis.com / maps.googleapis.com — those have their own auth
    // and would hang waiting for a token we don't need.
    const isOurCloudFunction = req.url.includes('cloudfunctions.net/') ||
                               req.url.includes('firebaseapp.com/') && req.url.includes('/api/');

    if (!isOurCloudFunction) {
      return next.handle(req);
    }

    // Use first() to take one emission then COMPLETE the observable
    // (idToken is an infinite BehaviorSubject — toPromise alone would hang forever)
    return this.afAuth.idToken.pipe(
      first(),
      switchMap((token: string | null) => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;
        return next.handle(authReq);
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Token expired — refresh once then retry
          return from(
            this.afAuth.authState.pipe(first()).toPromise()
              .then(u => u ? u.getIdToken(true) : null)
          ).pipe(
            switchMap((newToken: string | null) => {
              if (!newToken) {
                this.router.navigate(['/sign-in']);
                return throwError(err);
              }
              const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next.handle(retryReq);
            }),
            catchError(() => {
              this.router.navigate(['/sign-in']);
              return throwError(err);
            })
          );
        }
        return throwError(err);
      })
    );
  }
}
