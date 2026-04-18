import { Component, ChangeDetectionStrategy, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RbIconComponent } from '../rb-icon/rb-icon.component';

/**
 * Authenticated-area shell — Week-1 IA rewrite.
 *
 * Top-nav primitives (left → right):
 *   • logo (routes to /me)
 *   • [Me ▾]          dropdown: Feed / Portfolio / Badges / CV / Public profile
 *   • [Challenges]    /evaluate
 *   • [Talent ▾]      dropdown: AI-native directory / Leaderboard / (Employer dashboard if role)
 *   • [Jobs]          /jobs
 *   • 🔔 notifications
 *   • ✉  messages
 *   • ⚙  settings
 *   • avatar (placeholder for role-switch / sign-out, to be wired later)
 *
 * Inputs:
 *   @Input active      — which top-level nav item to highlight
 *   @Input subActive   — which Me-tab is active (when active='me'); drives the
 *                        dropdown's selection state. Values match /me tabs.
 *   @Input isAdmin     — shows the Admin link in the Me dropdown when true
 *   @Input isEmployer  — shows the Employer dashboard in the Talent dropdown
 *   @Input tight       — narrower main padding for dense reviewer pages
 *
 * Backward-compat: old `active` values ('dashboard' | 'profile' | 'ai-pair')
 * still accepted; 'dashboard' + 'profile' both map to the new 'me' highlight.
 */
type ActiveNav = 'me' | 'challenges' | 'talent' | 'jobs' | 'admin'
  | 'dashboard' | 'profile' | 'ai-pair' | null;

@Component({
  selector: 'rb-app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RbIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rb-app-shell.component.html',
  styleUrls: ['./rb-app-shell.component.scss']
})
export class RbAppShellComponent {
  @Input() active: ActiveNav = null;
  @Input() subActive: 'feed' | 'portfolio' | 'badges' | 'cv' | null = null;
  @Input() isAdmin = false;
  @Input() isEmployer = false;
  @Input() tight = false;

  // Local UI state — two dropdowns open independently. Escape closes both.
  meOpen = false;
  talentOpen = false;

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
    // Close dropdowns if the click landed outside any .rb-dd element.
    const t = ev.target as HTMLElement | null;
    if (!t) return;
    if (!t.closest || !t.closest('.rb-dd')) {
      this.closeMenus();
    }
  }
}
