import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-follow-orgs',
  templateUrl: './follow-orgs.component.html',
  styleUrls: ['./follow-orgs.component.scss']
})
export class FollowOrgsComponent implements OnInit {
  organisations: boolean = false;
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

  }
