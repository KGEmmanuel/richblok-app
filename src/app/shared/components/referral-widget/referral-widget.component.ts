import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ReferralService } from '../../services/referral.service';
import { ShareService } from '../../services/share.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ReferralStats } from '../../entites/Referral';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

@Component({
  selector: 'app-referral-widget',
  templateUrl: './referral-widget.component.html',
  styleUrls: ['./referral-widget.component.scss']
})
export class ReferralWidgetComponent implements OnInit {

  @Input() compact = false;

  inviteUrl = '';
  inviteCode = '';
  stats$: Observable<ReferralStats | null> = of(null);
  copied = false;

  constructor(
    private afAuth: AngularFireAuth,
    private referralSvc: ReferralService,
    private shareSvc: ShareService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.afAuth.authState.pipe(first()).subscribe(user => {
      if (user) {
        this.inviteCode = this.referralSvc.getInviteCode(user.uid);
        this.inviteUrl = this.referralSvc.getInviteUrl(user.uid);
      }
    });

    this.stats$ = this.afAuth.authState.pipe(
      switchMap(u => u ? this.referralSvc.getStats(u.uid) : of(null))
    );
  }

  private buildMessage(): string {
    return `I'm using Richblok to prove my skills to global recruiters — join with my link and get your first month free: ${this.inviteUrl}`;
  }

  shareWA() {
    this.analytics.track('ReferralShare', { channel: 'whatsapp' });
    this.shareSvc.shareToWhatsApp({
      url: this.inviteUrl,
      text: this.buildMessage(),
      context: 'referral'
    });
  }

  shareTwitter() {
    this.analytics.track('ReferralShare', { channel: 'twitter' });
    this.shareSvc.shareToTwitter({
      url: this.inviteUrl,
      text: 'Prove your skills to global recruiters on @Richblok — join with my link and get your first month free:',
      context: 'referral'
    });
  }

  shareLinkedIn() {
    this.analytics.track('ReferralShare', { channel: 'linkedin' });
    this.shareSvc.shareToLinkedIn({
      url: this.inviteUrl,
      text: this.buildMessage(),
      context: 'referral'
    });
  }

  copy() {
    this.analytics.track('ReferralShare', { channel: 'copy' });
    this.shareSvc.copyLink({ url: this.inviteUrl, context: 'referral' }).then(ok => {
      if (ok) {
        this.copied = true;
        setTimeout(() => this.copied = false, 2500);
      }
    });
  }
}
