import { Component } from '@angular/core';
import { UserService } from './shared/services/user.service';
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
  constructor(private loaderSvc: NgxUiLoaderService) {
    firebase.initializeApp(environment.firebase);
  }
}
