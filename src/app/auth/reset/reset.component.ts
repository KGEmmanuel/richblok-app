import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  mail: string;
  loading = false;
  sent = false;

  constructor(private authSvc: AuthService, private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('RichBlok | Reset password');
    this.meta.updateTag({ name: 'description', content: 'Reset your RichBlok account password.' });
  }

  reset() {
    if (!this.mail) { return; }
    this.loading = true;
    this.authSvc.ForgotPassword(this.mail)
      .then(() => { this.sent = true; })
      .catch(() => { /* toastr shown by AuthService */ })
      .then(() => { this.loading = false; });
  }
}
