import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Public (unauthenticated) shell.
 *
 * Used on landing, sign-in, sign-up, terms/privacy, sponsor — anywhere the
 * user doesn't have an account yet or isn't logged in. Simpler than
 * rb-app-shell: no in-app nav, just logo left + single CTA right, plus
 * a light footer with the legal links.
 *
 * Input `cta` picks the top-right action:
 *   'signin'  → "Sign in"
 *   'signup'  → "Get started"
 *   'home'    → "Home"
 *   null      → no CTA
 */
@Component({
  selector: 'rb-public-shell',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rb-public-shell.component.html',
  styleUrls: ['./rb-public-shell.component.scss']
})
export class RbPublicShellComponent {
  @Input() cta: 'signin' | 'signup' | 'home' | null = 'signin';

  /** Hide the footer for focus-mode pages (e.g. OAuth callback, 404). */
  @Input() hideFooter = false;
}
