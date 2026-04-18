import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
// D7 Day 2 Batch C — modular Firebase.
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, query, where, limit, getDocs } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  RbAppShellComponent,
  RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
  RbButtonComponent, RbChipComponent, RbStatComponent,
  RbIconComponent, RbEmptyStateComponent
} from '../shared/ui';

import { AnalyticsService } from '../shared/services/analytics.service';

/**
 * /me — unified user hub (Week-1 IA rewrite).
 *
 * Replaces the trio /feed + /record + /profile with a single surface that
 * has four tabs, each tied to a URL query param so the tab state is
 * shareable + deep-linkable:
 *
 *   /me                     → tab=feed      (default)
 *   /me?tab=feed            → Recent activity + stats + CTAs
 *   /me?tab=portfolio       → Experiences / Trainings / Realisations / Skills / Docs / Languages
 *   /me?tab=badges          → All badges earned by the current user
 *   /me?tab=cv              → Printable CV view (links to /cv for the legacy full-page render)
 *
 * Backward compat redirects handled at the router level:
 *   /feed      → /me?tab=feed
 *   /record    → /me?tab=portfolio
 *   /profile   → /me?tab=feed   (self-profile absorbed; /u/:handle remains public)
 *
 * This component is INTENTIONALLY simple — it does NOT re-implement the
 * legacy /record sub-form CRUD. The Portfolio tab links to /record/:section
 * style legacy routes for now; the full Portfolio-inside-/me absorption
 * is a Week-2 follow-up (requires converting record-experiences etc. to
 * standalone components first).
 */
type Tab = 'feed' | 'portfolio' | 'badges' | 'cv';

interface MeStats {
  badgesLifetime:  number;
  badgesThisWeek:  number;
  aiPairBadges:    number;
  topScore:        number | null;
  topVerification: number | null;
  challengesTaken: number;
  starStories:     number;
}

interface BadgeCard {
  id:        string;
  skill:     string;
  level:     string;
  score:     number;
  percentile?: number;
  challengeFormat?: string;
  aiToolUsed?: string;
  earnedAt:  Date | null;
  verificationScore?: number;
}

interface ActivityItem {
  type:  'badge' | 'star' | 'challenge';
  title: string;
  sub:   string;
  ts:    Date | null;
  href?: string;
}

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [
    CommonModule, RouterLink, DatePipe,
    RbAppShellComponent,
    RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
    RbButtonComponent, RbChipComponent, RbStatComponent,
    RbIconComponent, RbEmptyStateComponent
  ],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeComponent implements OnInit, OnDestroy {

  tab: Tab = 'feed';
  uid: string | null = null;
  userFirstName = '';
  loading = true;

  stats: MeStats = {
    badgesLifetime: 0,
    badgesThisWeek: 0,
    aiPairBadges: 0,
    topScore: null,
    topVerification: null,
    challengesTaken: 0,
    starStories: 0
  };

  badges: BadgeCard[] = [];
  activity: ActivityItem[] = [];

  readonly tabOptions: Array<{ key: Tab; label: string; icon: string }> = [
    { key: 'feed',      label: 'Feed',      icon: 'home' },
    { key: 'portfolio', label: 'Portfolio', icon: 'file-text' },
    { key: 'badges',    label: 'Badges',    icon: 'award' },
    { key: 'cv',        label: 'CV',        icon: 'file-text' }
  ];

  private sub?: Subscription;

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private analytics: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe(qp => {
      const t = qp.get('tab') as Tab | null;
      this.tab = (t === 'portfolio' || t === 'badges' || t === 'cv') ? t : 'feed';
      this.applyTitleForTab();
      this.analytics.track('MeTabView', { tab: this.tab });
      this.cdr.markForCheck();
    });

    // Resolve auth once — everything else depends on uid.
    const user = await authState(this.auth).pipe(first()).toPromise();
    if (!user) {
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }
    this.uid = user.uid;
    this.userFirstName = (user.displayName || user.email || '').split(/[\s@]/)[0];

    await Promise.all([this.loadBadges(), this.loadStats(), this.loadActivity()]);
    this.loading = false;
    this.cdr.markForCheck();
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  // ---- navigation ---------------------------------------------------------

  setTab(t: Tab, ev?: Event) {
    if (ev) { ev.preventDefault(); }
    if (t === this.tab) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: t },
      queryParamsHandling: 'merge'
    });
  }

  private applyTitleForTab() {
    const titles: Record<Tab, string> = {
      feed:      'Richblok · Your hub',
      portfolio: 'Richblok · Portfolio',
      badges:    'Richblok · Badges',
      cv:        'Richblok · CV'
    };
    this.title.setTitle(titles[this.tab] || 'Richblok · Your hub');
  }

  // ---- data loaders -------------------------------------------------------

  private async loadBadges() {
    if (!this.uid) return;
    try {
      const snap = await getDocs(query(
        collection(this.firestore, 'badges'),
        where('uid', '==', this.uid),
        limit(100)
      ));
      const rows: BadgeCard[] = [];
      snap.forEach(d => {
        const data: any = d.data();
        rows.push({
          id:               d.id,
          skill:            data.skill || 'Skill',
          level:            data.level || 'mid',
          score:            data.score || 0,
          percentile:       data.percentile,
          challengeFormat:  data.challengeFormat,
          aiToolUsed:       data.ai_tool_used,
          earnedAt:         data.earnedAt && data.earnedAt.toDate ? data.earnedAt.toDate() : null,
          verificationScore: data.verification_score
        });
      });
      // Newest first.
      rows.sort((a, b) => (b.earnedAt?.getTime() || 0) - (a.earnedAt?.getTime() || 0));
      this.badges = rows;
    } catch {
      this.badges = [];
    }
  }

  private async loadStats() {
    // Everything derived from this.badges + STAR profiles is local compute —
    // no extra round trips beyond what loadBadges + loadActivity already did.
    const b = this.badges;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    this.stats.badgesLifetime = b.length;
    this.stats.badgesThisWeek = b.filter(x => x.earnedAt && x.earnedAt.getTime() >= sevenDaysAgo).length;
    this.stats.aiPairBadges   = b.filter(x => x.challengeFormat === 'ai_pair').length;
    this.stats.topScore       = b.length ? Math.max(...b.map(x => x.score)) : null;
    const verScores = b.map(x => x.verificationScore || 0).filter(n => n > 0);
    this.stats.topVerification = verScores.length ? Math.max(...verScores) : null;

    // STAR profiles — count answers owned by this uid.
    if (this.uid) {
      try {
        const starSnap = await getDocs(query(
          collection(this.firestore, 'star_profiles'),
          where('uid', '==', this.uid)
        ));
        let count = 0;
        starSnap.forEach(d => {
          const data: any = d.data();
          if (Array.isArray(data.answers)) count += data.answers.length;
        });
        this.stats.starStories = count;
      } catch { /* ignore — non-fatal */ }
    }

    // challengesTaken is distinct challengeId across badges as a proxy.
    this.stats.challengesTaken = new Set(b.map(x => (x as any).challengeId).filter(Boolean)).size;
  }

  private async loadActivity() {
    const items: ActivityItem[] = [];
    for (const b of this.badges.slice(0, 10)) {
      items.push({
        type:  'badge',
        title: `Badge earned · ${b.skill} · ${b.level}`,
        sub:   `${b.score}/100${b.aiToolUsed ? ' · ' + b.aiToolUsed : ''}`,
        ts:    b.earnedAt,
        href:  `/badge/${b.id}`
      });
    }
    items.sort((a, b) => (b.ts?.getTime() || 0) - (a.ts?.getTime() || 0));
    this.activity = items.slice(0, 10);
  }

  // ---- ui helpers ---------------------------------------------------------

  aiToolLabel(t?: string): string {
    if (!t) return '';
    const map: { [k: string]: string } = {
      claude_code: 'Claude Code', cursor: 'Cursor', github_copilot: 'GitHub Copilot',
      openai_codex: 'Codex', replit_agent: 'Replit Agent', windsurf: 'Windsurf',
      lovable: 'Lovable', bolt: 'Bolt', v0: 'v0', other: 'Other', none: 'Unassisted'
    };
    return map[t] || t;
  }
}
