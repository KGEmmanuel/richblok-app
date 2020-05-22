import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Rib';
  firestore: firebase.firestore.Firestore;

  constructor(private loaderSvc: NgxUiLoaderService) {
    firebase.initializeApp(environment.firebase);

  }
}
