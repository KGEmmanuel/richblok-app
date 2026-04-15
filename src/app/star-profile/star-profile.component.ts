import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StarMapperService } from '../shared/services/star-mapper.service';
import { AnalyticsService } from '../shared/services/analytics.service';
import { ShareService } from '../shared/services/share.service';
import { StarProfile, StarAnswer } from '../shared/entites/StarProfile';
import { SeoService } from '../shared/services/seo.service';

@Component({
  selector: 'app-star-profile',
  templateUrl: './star-profile.component.html',
  styleUrls: ['./star-profile.component.scss']
})
export class StarProfileComponent implements OnInit {

  profile: StarProfile | null = null;
  loading = true;
  error: string | null = null;
  fromChallenge = false;
  expanded: { [i: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private starMapper: StarMapperService,
    private analytics: AnalyticsService,
    private shareSvc: ShareService,
    private seo: SeoService
  ) {}

  ngOnInit() {
    this.seo.setTags({
      title: 'Your STAR behavioral interview answers — Richblok',
      description: 'Verified STAR stories generated from your completed Richblok challenge.'
    });

    this.route.queryParamMap.subscribe(q => {
      this.fromChallenge = q.get('fromChallenge') === '1';
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No profile ID';
      this.loading = false;
      return;
    }

    this.analytics.track('ViewContent', { content_type: 'star_profile', content_id: id });

    this.starMapper.get(id).subscribe(p => {
      this.loading = false;
      if (!p) {
        this.error = 'STAR profile not found';
        return;
      }
      this.profile = p;
      // Auto-expand the first answer so the user sees value immediately
      this.expanded[0] = true;
    });
  }

  toggle(i: number) {
    this.expanded[i] = !this.expanded[i];
  }

  coach(i: number) {
    if (!this.profile || !this.profile.id) { return; }
    this.analytics.track('AICoachStart', { profileId: this.profile.id, competency: this.profile.answers[i].competency });
    this.router.navigate(['/coach', this.profile.id], { queryParams: { a: i } });
  }

  viewBadge() {
    if (this.profile && this.profile.badgeId) {
      this.router.navigate(['/badge', this.profile.badgeId]);
    }
  }

  share() {
    if (!this.profile) { return; }
    const origin = 'https://richblok-app-production-86b6.up.railway.app';
    const url = this.profile.badgeId ? `${origin}/badge/${this.profile.badgeId}` : origin;
    this.analytics.track('ShareStarProfile', { profileId: this.profile.id });
    this.shareSvc.shareToWhatsApp({
      url,
      text: `I just earned ${this.profile.answers.length} verified STAR interview stories on Richblok from the "${this.profile.challengeTitle}" challenge 🏆`,
      context: 'star_profile'
    });
  }

  copyAnswer(a: StarAnswer) {
    const text = `STAR answer — ${a.competencyLabel}\n\nQ: ${a.question}\n\nSituation: ${a.situation}\n\nTask: ${a.task}\n\nAction: ${a.action}\n\nResult: ${a.result}`;
    this.shareSvc.copyLink({ url: text, context: 'star_answer_copy' });
  }

  invitePod() {
    if (!this.profile) { return; }
    const msg =
      `I just earned a verified Richblok badge on "${this.profile.challengeTitle}" 🏆\n\n` +
      `Join my accountability pod — we do weekly check-ins and share STAR interview stories. ` +
      `Sign up with my link: https://richblok-app-production-86b6.up.railway.app/register?ref=POD`;
    this.analytics.track('WhatsAppPodInvite', { profileId: this.profile.id });
    this.shareSvc.shareToWhatsApp({
      url: 'https://richblok-app-production-86b6.up.railway.app',
      text: msg,
      context: 'accountability_pod'
    });
  }
}
