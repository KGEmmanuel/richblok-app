<<<<<<< HEAD
=======
import { Title, Meta } from '@angular/platform-browser';
import { UtilisateurService } from './../shared/services/utilisateur.service';
import { ToastrService } from 'ngx-toastr';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss',
  '../../assets/landing/css/bootstrap.min.css','../../assets/landing/css/animate.css', '../../assets/landing/css/fontawesome-all.css',
'../../assets/landing/css/line-awesome.min.css', '../../assets/landing/css/magnific-popup/magnific-popup.css', '../../assets/landing/css/owl-carousel/owl.carousel.css',
'../../assets/landing/css/base.css', '../../assets/landing/css/shortcodes.css','../../assets/landing/css/style.css',
'../../assets/landing/css/responsive.css', '../../assets/landing/css/theme-color/color-2.css', '../../assets/landing/css/color-customize/color-customizer.css' ]
})
export class LandingComponent implements OnInit {

<<<<<<< HEAD
  constructor(private route: Router) { }
form = false;
  ngOnInit() {
=======
  constructor(private route: Router, private toastr: ToastrService, private userSvc: UtilisateurService,
    private title: Title, private meta: Meta ) { }
form = false;
email: string;
  ngOnInit() {
    this.title.setTitle('RichBlok | Landing');
    this.meta.updateTag({ name: 'description', content: 'RichBlok landing page describing you our process and services' });
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  access(){
    this.form  = true;
  }
  gotologin() {
<<<<<<< HEAD
    console.log('going to login');
    if (firebase.auth().currentUser) {
      this.route.navigate(['/feed']);
    } else {
      this.route.navigate(['/sign-in']);
    }
  }
=======
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!re.test(String(this.email).toLowerCase())) {
      this.toastr.error('Enter a valid email address', 'Error');
      return false;
     }
     console.log('going to login');
  if (firebase.auth().currentUser) {
    this.route.navigate(['/feed']);
    this.toastr.success('The user is already authenticated', 'success');
  } else {
    this.userSvc.getByEmail(this.email).onSnapshot(val=>{
        if(val){
          this.toastr.success('The user exist', 'success');
          this.route.navigate(['/sign-in',{mail:this.email}]);
        }
        else{
          this.toastr.error('The user does not exist create an account', 'Error');
          this.route.navigate(['/sign-up',{mail:this.email}]);
        }
    });

  }
  }
  gotoCreate(){
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    console.log('going to login');
    if (firebase.auth().currentUser) {
      this.route.navigate(['/feed']);
      this.toastr.success('The user is already authenticated', 'success');
    } else {
      this.userSvc.getByEmail(this.email).onSnapshot(val=>{
          if(val){
            this.toastr.success('The user exist', 'success');
            this.route.navigate(['/sign-in',{mail:this.email}]);
          }
          else{
            this.toastr.error('The user does not exist create an account', 'Error');
            this.route.navigate(['/sign-up',{mail:this.email}]);
          }
      });

    }
}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
}
