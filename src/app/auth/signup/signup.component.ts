import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { ToastrService } from 'ngx-toastr';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { ReferralService } from 'src/app/shared/services/referral.service';
import { AnalyticsService } from 'src/app/shared/services/analytics.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  confirmpassword: string;
  step: number;
  regexp: any;
  fieldTextType: boolean;
  repeatFieldTextType: boolean;
  referralCode: string | null = null;

  user: Utilisateur;

  constructor(
    private AuthSvc: AuthService,
    private toastr: ToastrService,
    private userSvc: UtilisateurService,
    private referralSvc: ReferralService,
    private analytics: AnalyticsService,
    private loadingSvc: NgxUiLoaderService,
    public ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.title.setTitle('RichBlok | SignUp');
    this.meta.updateTag({ name: 'description', content: 'Create your account and prove your skills to global recruiters on RichBlok.' });
    this.analytics.pageView('signup');
    this.step = 1;
    this.user = new Utilisateur();

    // Route params (legacy ?mail= passthrough)
    if (this.route.snapshot.paramMap.get('mail')) {
      this.email = this.route.snapshot.paramMap.get('mail');
    }

    // Query params: ?ref= (referral code), ?plan= (upgrade intent), ?from= (source)
    this.route.queryParamMap.subscribe(q => {
      const ref = q.get('ref');
      if (ref) {
        this.referralCode = ref.toUpperCase();
        try { localStorage.setItem('richblok_ref', this.referralCode); } catch { /* ignore */ }
        this.analytics.track('ReferralLanded', { code: this.referralCode });
      } else {
        try {
          const stored = localStorage.getItem('richblok_ref');
          if (stored) { this.referralCode = stored; }
        } catch { /* ignore */ }
      }
      const from = q.get('from');
      if (from) { this.analytics.track('SignupSourceTracked', { from }); }
    });
  }

  valid(): boolean {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!re.test(String(this.email).toLowerCase())) {
      this.toastr.error('Enter a valid email address', 'Error');
      return false;
    }
    if (!this.password || this.password.length < 6) {
      this.toastr.error('Your password must have 6 or more characters', 'Error');
      return false;
    }
    if (this.password !== this.confirmpassword) {
      this.toastr.error('Your passwords must be identical', 'Error');
      return false;
    }
    return true;
  }

  next() {
    if (!this.valid()) { return; }
    this.step += 1;
  }

  back() { this.step -= 1; }

  signUp() {
    this.loadingSvc.start();
    this.AuthSvc.SignUp(this.email, this.password).then(v => {
      const uid = v && v.user ? v.user.uid : '';
      this.user.email = this.email;

      this.userSvc.set(this.user, uid).then(() => {
        // Fire CompleteRegistration (Meta Pixel + GA4)
        this.analytics.track('CompleteRegistration', { method: 'email', uid });
        this.analytics.identify(uid, { email: this.email });

        // Claim referral if one was tracked
        if (this.referralCode && uid) {
          this.referralSvc.claimReferral(this.referralCode, uid, this.email).catch(err => {
            // eslint-disable-next-line no-console
            console.warn('Referral claim warning:', err);
          });
          try { localStorage.removeItem('richblok_ref'); } catch { /* ignore */ }
        }

        this.loadingSvc.stop();
        this.ngZone.run(() => {
          // Drop the user into the challenge selection — aligns with "10 min to first badge" PRD promise
          this.router.navigate(['/evaluate']);
        });
      }).catch(err => {
        this.loadingSvc.stop();
        this.toastr.error('An error occurred: ' + err.message);
      });
    }).catch(err => {
      this.loadingSvc.stop();
      this.toastr.error('An error occurred: ' + err.message);
    });
  }

  deleteCenterOfInterest(tag: string) {
    const idx = this.user.tags.indexOf(tag);
    this.user.tags.splice(idx, 1);
  }

  addCenterOfInterest(tag: string) {
    if (!this.user.tags) { this.user.tags = []; }
    this.user.tags.push(tag);
  }

  loginWithGoogle() {
    this.AuthSvc.GoogleAuth();
    // AuthService.AuthLogin redirects to /feed on success. We fire registration event via auth state listener too.
    this.analytics.track('CompleteRegistration', { method: 'google' });
  }

  toggleFieldTextType() { this.fieldTextType = !this.fieldTextType; }
  toggleRepeatFieldTextType() { this.repeatFieldTextType = !this.repeatFieldTextType; }
}
