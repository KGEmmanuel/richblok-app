import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// D7 Day 2 Batch B — modular Firestore.
import { Firestore, doc, getDoc, collection, query, where, limit, getDocs } from '@angular/fire/firestore';

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

  private firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const handle = this.route.snapshot.paramMap.get('handle') || '';
    if (!handle) { this.error = true; return; }

    // Heuristic: Firestore uids are 28 chars, alphanumeric. Usernames are typically shorter.
    const looksLikeUid = /^[A-Za-z0-9]{20,40}$/.test(handle);

    if (looksLikeUid) {
      try {
        const snap = await getDoc(doc(this.firestore, 'utilisateurs', handle));
        if (snap.exists()) {
          this.router.navigate(['/profile', handle], { replaceUrl: true });
          return;
        }
      } catch { /* fall through */ }
    }
    await this.resolveByUsername(handle);
  }

  private async resolveByUsername(handle: string) {
    try {
      const coll = collection(this.firestore, 'utilisateurs');
      // Try username field match
      const byUsername = await getDocs(query(coll, where('username', '==', handle), limit(1)));
      if (!byUsername.empty) {
        this.router.navigate(['/profile', byUsername.docs[0].id], { replaceUrl: true });
        return;
      }

      // Try case-insensitive username (store usernameLower)
      const lowered = handle.toLowerCase();
      const byLower = await getDocs(query(coll, where('usernameLower', '==', lowered), limit(1)));
      if (!byLower.empty) {
        this.router.navigate(['/profile', byLower.docs[0].id], { replaceUrl: true });
        return;
      }

      // Last resort — email prefix
      const byEmail = await getDocs(query(coll, where('email', '==', `${handle}@gmail.com`), limit(1)));
      if (!byEmail.empty) {
        this.router.navigate(['/profile', byEmail.docs[0].id], { replaceUrl: true });
        return;
      }

      this.error = true;
    } catch (err) {
      console.error('UserResolver error:', err);
      this.error = true;
    }
  }
}
