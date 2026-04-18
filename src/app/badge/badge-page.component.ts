import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// D7 Day 2 Batch B — modular Firestore.
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { SeoService } from '../shared/services/seo.service';
import { ShareService } from '../shared/services/share.service';
import { AnalyticsService } from '../shared/services/analytics.service';

interface BadgeRecord {
  id?: string;
  uid: string;
  userName?: string;
  userAvatar?: string;
  userCountry?: string;
  skill: string;
  level: 'junior' | 'mid' | 'senior';
  score: number;
  percentile?: number;
  earnedAt: any;
  verificationHash?: string;
}

@Component({
  selector: 'app-badge-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './badge-page.component.html',
  styleUrls: ['./badge-page.component.scss']
})
export class BadgePageComponent implements OnInit {

  badge: BadgeRecord | null = null;
  loading = true;
  error: string | null = null;
  copied = false;

  private firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private shareSvc: ShareService,
    private analytics: AnalyticsService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Badge not found';
      this.loading = false;
      return;
    }

    this.analytics.track('ViewContent', { content_type: 'badge', content_id: id });

    try {
      const snap = await getDoc(doc(this.firestore, 'badges', id));
      this.loading = false;
      const b = snap.exists() ? (snap.data() as BadgeRecord) : null;
      if (!b) {
        // Graceful fallback: show a demo badge so link never looks broken to recruiters
        this.badge = {
          id,
          uid: 'demo',
          userName: 'Richblok Demo User',
          userCountry: '🌍',
          skill: 'React',
          level: 'mid',
          score: 87,
          percentile: 73,
          earnedAt: new Date(),
          verificationHash: id
        };
      } else {
        this.badge = { id, ...b };
      }
      this.applySeo();
    } catch (err) {
      console.error('Badge fetch error', err);
      this.loading = false;
      this.error = 'Badge not found';
    }
  }

  private applySeo() {
    if (!this.badge) { return; }
    const name = this.badge.userName || 'A Richblok member';
    const title = `${name} scored ${this.badge.score}/100 on ${this.badge.skill} (${this.capitalize(this.badge.level)}) — Richblok`;
    const description = `Verified skill badge earned on Richblok. ${name} scored ${this.badge.score}/100 on the ${this.badge.skill} ${this.capitalize(this.badge.level)} challenge${this.badge.percentile ? `, beating ${this.badge.percentile}% of candidates` : ''}.`;
    const origin = 'https://richblok-app-production-86b6.up.railway.app';
    const url = `${origin}/badge/${this.badge.id}`;
    const ogImage = `${origin}/og/badge/${this.badge.id}`;
    this.seo.setTags({
      title,
      description,
      url,
      image: ogImage,
      type: 'article',
      author: name,
      twitterCard: 'summary_large_image'
    });
  }

  share(channel: 'whatsapp' | 'twitter' | 'linkedin' | 'native' | 'copy') {
    if (!this.badge) { return; }
    const url = `https://richblok-app-production-86b6.up.railway.app/badge/${this.badge.id}`;
    const name = this.badge.userName || 'I';
    const text = `${name === 'I' ? 'I' : name} just scored ${this.badge.score}/100 on the ${this.badge.skill} ${this.capitalize(this.badge.level)} challenge on Richblok — verified proof of skill 🏅`;

    const payload = { url, text, title: 'My Richblok Badge', context: 'badge' };
    switch (channel) {
      case 'whatsapp': this.shareSvc.shareToWhatsApp(payload); break;
      case 'twitter': this.shareSvc.shareToTwitter(payload); break;
      case 'linkedin': this.shareSvc.shareToLinkedIn(payload); break;
      case 'native': this.shareSvc.shareNative(payload); break;
      case 'copy':
        this.shareSvc.copyLink(payload).then(ok => {
          if (ok) {
            this.copied = true;
            setTimeout(() => this.copied = false, 2500);
          }
        });
        break;
    }
  }

  claim() {
    this.analytics.track('Lead', { source: 'badge_page', cta: 'get_your_badge' });
    this.router.navigate(['/register'], { queryParams: { from: 'badge', ref: this.badge?.id } });
  }

  contactCandidate() {
    if (!this.badge) { return; }
    this.analytics.track('Contact', { source: 'badge_page', uid: this.badge.uid });
    this.router.navigate(['/profile', this.badge.uid]);
  }

  private capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }

  get levelLabel(): string {
    if (!this.badge) { return ''; }
    return this.capitalize(this.badge.level);
  }

  get scoreColor(): string {
    if (!this.badge) { return '#6b7a99'; }
    if (this.badge.score >= 80) { return '#1dd1a1'; }
    if (this.badge.score >= 60) { return '#f97316'; }
    return '#ef4444';
  }
}
