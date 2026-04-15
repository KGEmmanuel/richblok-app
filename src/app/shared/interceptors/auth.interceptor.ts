import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip non-Firebase URLs
    const isFirebaseUrl = req.url.includes('firebase') ||
                         req.url.includes('cloudfunctions.net') ||
                         req.url.includes('googleapis.com');

    if (!isFirebaseUrl) {
      return next.handle(req);
    }

    return from(this.afAuth.idToken.toPromise().then(t => t || null) as Promise<string | null>).pipe(
      switchMap((token: string | null) => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;
        return next.handle(authReq);
      }),
      retry(1),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Token expired or invalid — try refreshing once
          return from(
            this.afAuth.authState.toPromise().then(u => u ? u.getIdToken(true) : null) as Promise<string | null>
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
