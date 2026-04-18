import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
// D7 Day 2 Batch B — modular Firestore.
import { Firestore, collection, query, where, limit, getDocs } from '@angular/fire/firestore';

import {
  RbPublicShellComponent,
  RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
  RbButtonComponent, RbChipComponent, RbEmptyStateComponent
} from '../shared/ui';

import { AnalyticsService } from '../shared/services/analytics.service';

/**
 * F23 — Public discovery page for verified AI-native candidates.
 *
 * Route: /ai-native  (NO auth — this is the SEO surface).
 *
 * Lists the top 100 holders of `challengeFormat === 'ai_pair'` badges
 * ordered by verification_score then overall score. Each card links to
 * the public badge page (/badge/:id). Designed to rank for long-tail
 * queries like "hire AI-native engineer" / "claude code verified
 * developer" / "AI pair programming portfolio".
 *
 * SEO notes:
 *  - <title> + <meta description> set in ngOnInit.
 *  - Content-heavy hero (h1 + intro paragraph + 100 cards with candidate
 *    names and AI tool used) gives indexable structure.
 *  - Badge-ID deep links mean Google indexes a full graph of
 *    /ai-native → /badge/:id → candidate profile.
 */

interface DiscoveryCard {
  badgeId: string;
  uid: string;
  userName: string;
  userCountry?: string;
  level: string;
  score: number;
  verificationScore: number;
  aiTool: string;
  aiCompetencies: string[];
  earnedAt: Date | null;
}

const AI_TOOL_LABELS: { [k: string]: string } = {
  claude_code:    'Claude Code',
  cursor:         'Cursor',
  github_copilot: 'GitHub Copilot',
  openai_codex:   'OpenAI Codex',
  replit_agent:   'Replit',
  windsurf:       'Windsurf',
  lovable:        'Lovable',
  bolt:           'Bolt',
  v0:             'v0',
  other:          'Other',
  none:           'Unassisted'
};

const AI_COMPETENCY_LABELS: { [k: string]: string } = {
  ai_pair_programming:     'AI pair programming',
  ai_tool_orchestration:   'AI tool orchestration',
  verification_discipline: 'Verification discipline',
  ai_cost_consciousness:   'AI cost consciousness'
};

@Component({
  selector: 'app-ai-native-discovery',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    RbPublicShellComponent,
    RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
    RbButtonComponent, RbChipComponent, RbEmptyStateComponent
  ],
  templateUrl: './ai-native-discovery.component.html',
  styleUrls: ['./ai-native-discovery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiNativeDiscoveryComponent implements OnInit {
  loading = true;
  cards: DiscoveryCard[] = [];

  // Simple stats surfaced in the hero for social proof.
  totalAiNativeBadges = 0;
  uniqueCandidates = 0;
  uniqueTools = 0;
  uniqueCountries = 0;

  private firestore = inject(Firestore);

  constructor(
    private title: Title,
    private meta: Meta,
    private analytics: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    // SEO — the whole point of this page.
    this.title.setTitle('Verified AI-native engineers · Richblok');
    this.meta.updateTag({
      name: 'description',
      content: 'Top 100 developers with verified AI-pair programming credentials. Scored by Claude across correctness, verification discipline, and cost consciousness. Hire-ready.'
    });
    // Canonical for Google.
    this.meta.updateTag({ rel: 'canonical', href: 'https://richblok-app-production-86b6.up.railway.app/ai-native' });
    // Basic Open Graph for social shares.
    this.meta.updateTag({ property: 'og:title', content: 'Verified AI-native engineers · Richblok' });
    this.meta.updateTag({ property: 'og:description', content: 'Top 100 developers with real AI-pair programming credentials.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.analytics.pageView('ai_native_discovery');
    await this.loadTopCards();
  }

  private async loadTopCards() {
    try {
      // Only AI-pair passing badges. Firestore supports a compound filter
      // here; limit 200 then post-sort client-side to avoid a composite
      // index requirement (same pattern as /admin/pending-reviews).
      const q = query(
        collection(this.firestore, 'badges'),
        where('challengeFormat', '==', 'ai_pair'),
        where('passed', '==', true),
        limit(200)
      );
      const snap = await getDocs(q);

      const rows: DiscoveryCard[] = [];
      const tools = new Set<string>();
      const countries = new Set<string>();
      const uids = new Set<string>();

      snap.forEach(d => {
        const data: any = d.data();
        if (!data.uid) return;
        rows.push({
          badgeId: d.id,
          uid: data.uid,
          userName: data.userName || 'Anonymous',
          userCountry: data.userCountry,
          level: data.level || 'mid',
          score: data.score || 0,
          verificationScore: data.verification_score || 0,
          aiTool: data.ai_tool_used || 'other',
          aiCompetencies: Array.isArray(data.ai_competencies) ? data.ai_competencies : [],
          earnedAt: data.earnedAt && data.earnedAt.toDate ? data.earnedAt.toDate() : null
        });
        uids.add(data.uid);
        if (data.ai_tool_used) tools.add(data.ai_tool_used);
        if (data.userCountry)  countries.add(data.userCountry);
      });

      // Rank by verification-discipline first (the scarce signal employers
      // filter on), then overall score. Top 100.
      rows.sort((a, b) => {
        if (b.verificationScore !== a.verificationScore) return b.verificationScore - a.verificationScore;
        return b.score - a.score;
      });

      this.cards = rows.slice(0, 100);
      this.totalAiNativeBadges = snap.size;
      this.uniqueCandidates = uids.size;
      this.uniqueTools = tools.size;
      this.uniqueCountries = countries.size;
    } catch (err) {
      // Public page — never throw at the user. Empty state is an acceptable
      // degradation (the cold start problem actually shows the empty state).
      this.cards = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  aiToolLabel(t: string): string {
    return AI_TOOL_LABELS[t] || t;
  }

  aiCompetencyLabel(t: string): string {
    return AI_COMPETENCY_LABELS[t] || t;
  }

  levelBadgeColor(level: string): string {
    if (level === 'senior') return 'verified';
    if (level === 'mid')    return 'default';
    return 'default';
  }
}
