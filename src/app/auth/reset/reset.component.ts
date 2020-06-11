import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  mail;
  constructor(private authSvc: AuthService) { }

  ngOnInit() {
  }


  reset(){
    this.authSvc.ForgotPassword(this.mail);
  }
}
