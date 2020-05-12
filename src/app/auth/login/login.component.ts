import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  mail;
  pass;
  errorMessage ;;
  successMessage ;
  constructor(private AuthSvc: AuthService) { }

  ngOnInit() {
  }


  login(){

    console.log('in login');
    this.AuthSvc.SignIn(this.mail,this.pass).then(v=>{
       this.successMessage = 'Connected';
    }).catch(err=>{
      this.successMessage = 'An Error occured',err.message;
      window.alert(err);
    })
  }

  loginWithGoogle(){
    this.AuthSvc.GoogleAuth();
  }

}
