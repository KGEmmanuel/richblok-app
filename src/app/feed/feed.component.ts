import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
  RbStatComponent, RbChipComponent, RbIconComponent,
  RbButtonComponent, RbEmptyStateComponent
} from '../shared/ui';

interface RecentActivity {
  kind: 'badge' | 'star_draft' | 'challenge_completed';
  title: string;
  sub: string;
  timestamp: Date | null;
  routerLink?: any[];
  chipVariant?: 'verified' | 'draft' | 'accent';
  chipText?: string;
}

interface SuggestedChallenge {
  slug: string;
  titre: string;
  estimatedDuration: string;
  skills: string[];
}

/**
 * Richblok V5 Feed — rewritten from the 2019 Bootstrap social feed template
 * into a focused personal dashboard. Shows:
 *   - Weekly summary stats (challenges, badges, STAR stories, top score)
 *   - Recent activity timeline (badges earned, STAR drafts, challenge attempts)
 *   - One suggested next action (a challenge to take)
 *
 * No social feed. No posts. No friends list. Users who want social share
 * their badge via /badge/:id. This is a productivity dashboard — the same
 * shape Linear, Vercel, and Stripe use for their post-login home.
 */
@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
    RbStatComponent, RbChipComponent, RbIconComponent,
    RbButtonComponent, RbEmptyStateComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  loading = true;
  userName = '';
  userFirstName = '';

  // Weekly stats
  challengesThisWeek = 0;
  badgesThisWeek = 0;
  starsThisWeek = 0;
  topScore: number | null = null;
  topScorePercentile: number | null = null;

  // Lifetime counters (subtle secondary stats)
  totalBadges = 0;
  totalChallenges = 0;

  // Activity feed
  activity: RecentActivity[] = [];

  // One suggested next action
  suggested: SuggestedChallenge | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit() {
    this.title.setTitle('Richblok · Dashboard');
    this.meta.updateTag({
      name: 'description',
      content: 'Your Richblok verified credentials and recent activity.'
    });

    this.afAuth.authState.pipe(first()).subscribe(user => {
      if (!user) {
        this.loading = false;
        return;
      }
      this.loadDashboard(user.uid);
    });
  }

  private loadDashboard(uid: string) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Parallel fetch: user profile, badges, star profiles, challenge catalog
    Promise.all([
      this.afs.doc(`utilisateurs/${uid}`).valueChanges().pipe(first()).toPromise(),
      this.afs.collection('badges', ref => ref.where('uid', '==', uid).orderBy('earnedAt', 'desc').limit(20))
        .get().pipe(first()).toPromise(),
      this.afs.collection('star_profiles', ref => ref.where('uid', '==', uid).orderBy('createdAt', 'desc').limit(10))
        .get().pipe(first()).toPromise(),
      this.afs.collection('challenges', ref => ref.where('creatorType', '==', 'SYS').limit(10))
        .get().pipe(first()).toPromise(),
    ]).then(([userDoc, badgesSnap, starsSnap, challengesSnap]: any[]) => {
      const u: any = userDoc || {};
      this.userName = [u.prenom, u.nom].filter(Boolean).join(' ') || u.email || '';
      this.userFirstName = u.prenom || (this.userName.split(' ')[0] || 'there');

      // Badges
      const badges: any[] = (badgesSnap?.docs || []).map((d: any) => ({
        id: d.id, ...d.data()
      }));
      this.totalBadges = badges.length;
      const recentBadges = badges.filter(b => {
        const d = b.earnedAt?.toDate?.();
        return d && d > weekAgo;
      });
      this.badgesThisWeek = recentBadges.length;
      this.challengesThisWeek = this.badgesThisWeek; // badges == challenge attempts
      this.totalChallenges = badges.length;

      const scores = badges.map(b => b.score || 0).filter(s => s > 0);
      if (scores.length) {
        this.topScore = Math.max(...scores);
        this.topScorePercentile = Math.max(...badges.map(b => b.percentile || 0));
      }

      // Star stories
      const profiles: any[] = (starsSnap?.docs || []).map((d: any) => ({
        id: d.id, ...d.data()
      }));
      let starCount = 0;
      profiles.forEach(p => {
        const created = p.createdAt?.toDate?.();
        const answers = p.answers || [];
        if (created && created > weekAgo) {
          starCount += answers.length;
        }
      });
      this.starsThisWeek = starCount;

      // Build activity feed (latest 6 items, mixed)
      const items: RecentActivity[] = [];
      for (const b of badges.slice(0, 5)) {
        items.push({
          kind: 'badge',
          title: `${b.skill || 'Skill'} · ${b.level || 'mid'} level`,
          sub: `Scored ${b.score || 0}/100${b.percentile ? ' · Top ' + (100 - b.percentile) + '%' : ''}`,
          timestamp: b.earnedAt?.toDate?.() || null,
          routerLink: ['/badge', b.id],
          chipVariant: b.passed ? 'verified' : 'draft',
          chipText: b.passed ? '✓ Verified' : '● Not passed'
        });
      }
      for (const p of profiles.slice(0, 3)) {
        const hasVerified = (p.answers || []).some((a: any) => a.verified);
        items.push({
          kind: 'star_draft',
          title: `STAR profile — ${(p.answers || []).length} stories`,
          sub: p.challengeTitle || p.cvProfileName || 'From your CV or challenge',
          timestamp: p.createdAt?.toDate?.() || null,
          routerLink: ['/star', p.id],
          chipVariant: hasVerified ? 'verified' : 'draft',
          chipText: hasVerified ? '✓ Verified' : '● Draft'
        });
      }
      items.sort((a, b) => {
        const ta = a.timestamp?.getTime() || 0;
        const tb = b.timestamp?.getTime() || 0;
        return tb - ta;
      });
      this.activity = items.slice(0, 6);

      // Pick a suggested challenge — one the user hasn't attempted yet
      const takenSlugs = new Set(badges.map(b => b.challengeSlug).filter(Boolean));
      const catalog: any[] = (challengesSnap?.docs || []).map((d: any) => ({
        id: d.id, ...d.data()
      }));
      const fresh = catalog.find(c => c.slug && !takenSlugs.has(c.slug)) || catalog[0];
      if (fresh) {
        this.suggested = {
          slug: fresh.slug || fresh.id,
          titre: fresh.titre || 'Untitled challenge',
          estimatedDuration: fresh.estimatedDuration || '20 minutes',
          skills: fresh.skills || []
        };
      }

      this.loading = false;
    }).catch(err => {
      console.warn('[feed] dashboard load failed:', err?.message || err);
      this.loading = false;
    });
  }

  relativeTime(d: Date | null): string {
    if (!d) { return ''; }
    const diff = Date.now() - d.getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) { return 'just now'; }
    if (mins < 60) { return mins + 'm ago'; }
    const hrs = Math.round(mins / 60);
    if (hrs < 24) { return hrs + 'h ago'; }
    const days = Math.round(hrs / 24);
    if (days < 7) { return days + 'd ago'; }
    const weeks = Math.round(days / 7);
    return weeks + 'w ago';
  }
}
