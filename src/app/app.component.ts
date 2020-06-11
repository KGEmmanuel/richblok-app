<<<<<<< HEAD
import { Component } from '@angular/core';
import { UserService } from './shared/services/user.service';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
=======
import { Component, OnInit  } from '@angular/core';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
<<<<<<< HEAD
export class AppComponent {
  title = 'Rib';
  constructor() {
    firebase.initializeApp(environment.firebase);
=======

export class AppComponent {
  title = 'RichBlok';
  firestore: firebase.firestore.Firestore;

  // tslint:disable-next-line: max-line-length
  constructor(private loaderSvc: NgxUiLoaderService, private router: Router, private titleService: Title, private activatedRoute: ActivatedRoute) {
    firebase.initializeApp(environment.firebase);

  }
  ngOnInit() {
    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }
}
