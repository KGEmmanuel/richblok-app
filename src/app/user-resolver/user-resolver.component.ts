import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';

/**
 * Resolves /u/:handle to /profile/:uid.
 * `:handle` accepts either a Firestore uid (fast path) or a username.
 * Username resolution: first try exact match on utilisateurs.username,
 * then fall back to a case-insensitive email prefix match.
 */
@Component({
  selector: 'app-user-resolver',
  template: `
    <div class="rb-resolver" *ngIf="!error">
      <div class="rb-spinner"></div>
      <p>Loading profile…</p>
    </div>
    <div class="rb-error" *ngIf="error">
      <h2>Profile not found</h2>
      <p>The profile you were looking for doesn't exist.</p>
      <a [routerLink]="['/landing']">Back to Richblok</a>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #0b1220;
      color: #fff;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .rb-resolver, .rb-error {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 100vh; text-align: center;
    }
    .rb-spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(29, 209, 161, 0.2);
      border-top-color: #1dd1a1;
      border-radius: 50%;
      animation: rb-spin 1s linear infinite;
      margin-bottom: 16px;
    }
    .rb-error a {
      margin-top: 16px; color: #1dd1a1;
    }
    @keyframes rb-spin { to { transform: rotate(360deg); } }
  `]
})
export class UserResolverComponent implements OnInit {

  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    const handle = this.route.snapshot.paramMap.get('handle') || '';
    if (!handle) { this.error = true; return; }

    // Heuristic: Firestore uids are 28 chars, alphanumeric. Usernames are typically shorter.
    const looksLikeUid = /^[A-Za-z0-9]{20,40}$/.test(handle);

    if (looksLikeUid) {
      // Fast path — go directly
      this.afs.doc(`utilisateurs/${handle}`).get().pipe(first()).toPromise().then(snap => {
        if (snap && snap.exists) {
          this.router.navigate(['/profile', handle], { replaceUrl: true });
        } else {
          this.resolveByUsername(handle);
        }
      }).catch(() => this.resolveByUsername(handle));
    } else {
      this.resolveByUsername(handle);
    }
  }

  private async resolveByUsername(handle: string) {
    try {
      // Try username field match
      const byUsername = await this.afs.collection('utilisateurs', ref =>
        ref.where('username', '==', handle).limit(1)
      ).get().pipe(first()).toPromise();
      if (byUsername && !byUsername.empty) {
        const uid = byUsername.docs[0].id;
        this.router.navigate(['/profile', uid], { replaceUrl: true });
        return;
      }

      // Try case-insensitive username (store usernameLower)
      const lowered = handle.toLowerCase();
      const byLower = await this.afs.collection('utilisateurs', ref =>
        ref.where('usernameLower', '==', lowered).limit(1)
      ).get().pipe(first()).toPromise();
      if (byLower && !byLower.empty) {
        const uid = byLower.docs[0].id;
        this.router.navigate(['/profile', uid], { replaceUrl: true });
        return;
      }

      // Last resort — email prefix
      const byEmail = await this.afs.collection('utilisateurs', ref =>
        ref.where('email', '==', `${handle}@gmail.com`).limit(1)
      ).get().pipe(first()).toPromise();
      if (byEmail && !byEmail.empty) {
        const uid = byEmail.docs[0].id;
        this.router.navigate(['/profile', uid], { replaceUrl: true });
        return;
      }

      this.error = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('UserResolver error:', err);
      this.error = true;
    }
  }
}
