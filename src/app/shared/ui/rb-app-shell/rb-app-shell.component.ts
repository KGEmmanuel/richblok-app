import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RbIconComponent } from '../rb-icon/rb-icon.component';

/**
 * Authenticated-area shell.
 *
 * Provides the sticky top nav (logo + Dashboard / Challenges / Profile / Jobs
 * / optional Admin) and a centered 1200px-max content area.
 * Pages project their content into <rb-app-shell>{{content}}</rb-app-shell>
 * and get the V5 chrome for free — no more per-page copy of the nav bar.
 *
 * Usage:
 *   <rb-app-shell active="challenges">
 *     <!-- page content -->
 *   </rb-app-shell>
 *
 * Input `active` names the current section so the nav highlights correctly.
 * Values: 'dashboard' | 'challenges' | 'profile' | 'jobs' | 'ai-pair' | null.
 */
@Component({
  selector: 'rb-app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RbIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rb-app-shell.component.html',
  styleUrls: ['./rb-app-shell.component.scss']
})
export class RbAppShellComponent {
  /** Which nav item is active. Falsy → no item highlighted. */
  @Input() active: 'dashboard' | 'challenges' | 'profile' | 'jobs' | 'ai-pair' | 'admin' | null = null;

  /** Show the admin link. Caller decides based on the user's role. */
  @Input() isAdmin = false;

  /** Tight variant collapses padding for dense reviewer pages. */
  @Input() tight = false;
}
