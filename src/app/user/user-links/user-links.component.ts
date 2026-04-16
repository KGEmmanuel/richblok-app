import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore'
@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.scss']
})
export class UserLinksComponent implements OnInit {

  currentUser: Utilisateur;
  views = 0;
  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private userSvc: UserService) {

  }

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v;
          this.views = this.currentUser.visiteurs ? this.currentUser.visiteurs.length : 0;
        });
      }
    });
    this.currentUser = new Utilisateur();
  }
}
