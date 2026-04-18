import {
  Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, HostListener, OnInit, OnDestroy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { RbIconComponent } from '../rb-icon/rb-icon.component';
import { UtilisateurService } from '../../services/utilisateur.service';

/**
 * Authenticated-area shell (MVP Sprint A).
 *
 * Top-nav primitives (left → right):
 *   • logo (routes to /me)
 *   • [Me ▾]          dropdown: Feed / Badges / Settings / (Admin if role)
 *   • [Challenges]    /evaluate
 *   • [Talent ▾]      dropdown: AI-native directory / Leaderboard / Employer dashboard (if role)
 *   • 🔔 / ✉  / ⚙  hide-for-now — /notifications + /messages are deferred routes.
 *
 * Employer-gated: the shell reads the current user's `typeCompte` from
 * UtilisateurService; when it equals 'employer' the Employer dashboard link
 * appears in the Talent dropdown automatically. Callers can still pass
 * [isEmployer] explicitly (e.g. admin impersonation), which wins over the
 * auto-detected value.
 *
 * Deferred in MVP Sprint A (redirected at the router):
 *   /jobs → /evaluate       /friends → /me         /record → /me?tab=badges
 *   /cv   → /onboard        /messages + /notifications → /me
 * The shell no longer surfaces those links. Stale deep-link URLs still
 * redirect cleanly at the router level.
 */
type ActiveNav = 'me' | 'challenges' | 'talent' | 'admin'
  | 'dashboard' | 'profile' | 'ai-pair' | null;

@Component({
  selector: 'rb-app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RbIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rb-app-shell.component.html',
  styleUrls: ['./rb-app-shell.component.scss']
})
export class RbAppShellComponent implements OnInit, OnDestroy {
  @Input() active: ActiveNav = null;
  /**
   * Which /me tab is active. Portfolio/CV retired in MVP Sprint A but the
   * type accepts them so callers on old branches don't break.
   */
  @Input() subActive: 'feed' | 'portfolio' | 'badges' | 'cv' | null = null;
  @Input() isAdmin = false;
  /**
   * Explicit override — if set true/false via binding, wins over the auto-
   * detected user.typeCompte check. Left `null` to let the shell read the
   * current user's account type itself.
   */
  @Input() isEmployer: boolean | null = null;
  @Input() tight = false;

  // Local UI state — two dropdowns open independently. Escape closes both.
  meOpen = false;
  talentOpen = false;

  /** Auto-detected from the signed-in user's profile document. */
  autoIsEmployer = false;

  private auth = inject(Auth);
  private userSvc = inject(UtilisateurService);
  private cdr = inject(ChangeDetectorRef);
  private sub?: Subscription;

  ngOnInit() {
    // When no explicit [isEmployer] binding is provided, subscribe to the
    // current user's profile and flip autoIsEmployer when typeCompte === 'employer'.
    // This closes the Week-4 gap where the role switcher wrote to Firestore but
    // the premium shell never re-read the value.
    this.sub = authState(this.auth).subscribe((u: any) => {
      if (!u?.uid) { this.autoIsEmployer = false; this.cdr.markForCheck(); return; }
      this.userSvc.get(u.uid).subscribe((profile: any) => {
        this.autoIsEmployer = profile?.typeCompte === 'employer';
        this.cdr.markForCheck();
      });
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  /** Effective flag used in the template: explicit input wins, else auto. */
  get effectiveIsEmployer(): boolean {
    return this.isEmployer === true || (this.isEmployer === null && this.autoIsEmployer);
  }

  // Map legacy `active` values to the new 'me' highlight so old callers
  // (feed, record, user, user-view, etc.) still light up correctly.
  get activeIsMe(): boolean {
    return this.active === 'me' || this.active === 'dashboard' || this.active === 'profile';
  }

  toggleMe(ev?: Event)     { ev && ev.stopPropagation(); this.meOpen = !this.meOpen; this.talentOpen = false; }
  toggleTalent(ev?: Event) { ev && ev.stopPropagation(); this.talentOpen = !this.talentOpen; this.meOpen = false; }
  closeMenus()             { this.meOpen = false; this.talentOpen = false; }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeMenus(); }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const t = ev.target as HTMLElement | null;
    if (!t) return;
    if (!t.closest || !t.closest('.rb-dd')) {
      this.closeMenus();
    }
  }
}
