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

  constructor(private route: Router) { }
form = false;
  ngOnInit() {
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
    console.log('going to login');
    if (firebase.auth().currentUser) {
      this.route.navigate(['/feed']);
    } else {
      this.route.navigate(['/sign-in']);
    }
  }
}
