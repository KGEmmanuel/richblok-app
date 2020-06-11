<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
=======
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

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
  fieldTextType: boolean;

<<<<<<< HEAD
  constructor(private AuthSvc: AuthService) { }

  ngOnInit() {
=======
  constructor(private AuthSvc: AuthService,private route: ActivatedRoute, private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | LogIn');
    this.meta.updateTag({ name: 'description', content: 'Welcome back. Connect to your account and continue to build and enlarge your RichBlok Community' });
    if (this.route.snapshot.paramMap.get('mail')) {
      this.mail = this.route.snapshot.paramMap.get('mail');
     // alert(this.currentitemId);
    }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
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
