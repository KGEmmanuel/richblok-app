import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  mail: string;
  pass: string;
  errorMessage: string;
  successMessage: string;
  fieldTextType: boolean;
  loading = false;

  constructor(
    private AuthSvc: AuthService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    this.title.setTitle('RichBlok | LogIn');
    this.meta.updateTag({ name: 'description', content: 'Welcome back. Connect to your account and continue to build and enlarge your RichBlok Community' });
    if (this.route.snapshot.paramMap.get('mail')) {
      this.mail = this.route.snapshot.paramMap.get('mail');
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  login() {
    if (!this.mail || !this.pass) {
      this.errorMessage = this.i18n.t('signin_validation', 'Please enter both email and password.');
      return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.AuthSvc.SignIn(this.mail, this.pass)
      .then(() => {
        this.successMessage = this.i18n.t('signin_success', 'Connected');
      })
      .catch(() => {
        this.errorMessage = this.i18n.t('signin_failed', 'Sign-in failed. Check the notification for details.');
      })
      .then(() => { this.loading = false; });
  }

  loginWithGoogle() {
    this.AuthSvc.GoogleAuth();
  }
}
