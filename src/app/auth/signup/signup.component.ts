import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email;
  password;
  confirmpassword;
  step: number;
  regexp:any;
  fieldTextType: boolean;
  repeatFieldTextType: boolean;

  user: Utilisateur;
  constructor(private AuthSvc: AuthService, private toastr: ToastrService) { }
  ngOnInit() {
    this.step = 1;
    this.user = new Utilisateur();
    // tslint:disable-next-line: max-line-length
  }
  valid(): boolean{
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!re.test(String(this.email).toLowerCase())) {
      this.toastr.error('Enter a valid email address', 'Error');
      return false;
     }
    if (this.password.length < 6) {
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
    if (!this.valid()) {
      return;
    }
    this.step += 1;
  }
  back() {
    this.step -= 1;
  }

  signUp() {
    // tslint:disable-next-line: no-unused-expression
    this.AuthSvc.SignUp(this.email, this.password).then;
  }
  loginWithGoogle() {
    this.AuthSvc.GoogleAuth();
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

}
