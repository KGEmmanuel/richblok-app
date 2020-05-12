import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../shared/services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser: Utilisateur;
  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private userSvc: UserService, private router: Router) {

  }

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v;
        });
      }
    });
    this.currentUser = new Utilisateur();
  }

  logout(){
    this.AuthSvc.SignOut();
  }

  feed() {
    this.router.navigateByUrl('/feed');
  }

  messages() {
    this.router.navigateByUrl('/messages');
  }

  record() {
    this.router.navigateByUrl('/record');
  }

  demonstrate() {
    this.router.navigateByUrl('/demonstrate');
  }

  evaluate() {
    this.router.navigateByUrl('/evaluate');
  }

  jobs() {
    this.router.navigateByUrl('/jobs');
  }

  friends() {
    this.router.navigateByUrl('/friends');
  }

  notifications() {
    this.router.navigateByUrl('/notifications');
  }

}
