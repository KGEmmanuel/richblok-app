import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import {
  RbPublicShellComponent,
  RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
  RbEmptyStateComponent, RbChipComponent
} from '../shared/ui';

import { AnalyticsService } from '../shared/services/analytics.service';

/**
 * F24 — Weekly leaderboard (public).
 *
 * Route: /leaderboard  (no auth, cached for 60s at the server)
 *
 * Two tabs: All challenges and AI-pair only. Defaults to the 7-day window.
 * Re-ranks locally when the tab changes to avoid a second round-trip.
 */

interface Entry {
  uid: string;
  userName: string;
  userCountry: string;
  badgeCount: number;
  totalScore: number;
  maxScore: number;
  maxVerificationScore: number;
  topBadgeId: string | null;
  aiTools: string[];
  uniqueChallenges: number;
}

interface LeaderboardResponse {
  entries: Entry[];
  windowDays: number;
  format: 'all' | 'ai_pair';
  total: number;
  generatedAt: string;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    RbPublicShellComponent,
    RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
    RbEmptyStateComponent, RbChipComponent
  ],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent implements OnInit {
  loading = true;
  format: 'all' | 'ai_pair' = 'all';
  entries: Entry[] = [];
  total = 0;
  windowDays = 7;
  generatedAt: string | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    private http: HttpClient,
    private analytics: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.title.setTitle('Weekly leaderboard · Richblok');
    this.meta.updateTag({
      name: 'description',
      content: 'Top 50 Richblok candidates this week, ranked by verified badge score. AI-pair tab highlights verification discipline.'
    });
    this.analytics.pageView('leaderboard');
    this.reload();
  }

  setFormat(f: 'all' | 'ai_pair') {
    if (this.format === f) return;
    this.format = f;
    this.analytics.track('LeaderboardTabSwitch', { format: f });
    this.reload();
  }

  private reload() {
    this.loading = true;
    this.cdr.markForCheck();
    this.http
      .get<LeaderboardResponse>(`/api/leaderboard?format=${this.format}&days=${this.windowDays}`)
      .subscribe({
        next: (resp) => {
          this.entries = resp.entries || [];
          this.total = resp.total || 0;
          this.generatedAt = resp.generatedAt || null;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.entries = [];
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }
}
