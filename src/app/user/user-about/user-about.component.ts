import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Auth, authState } from '@angular/fire/auth';

// D7 Day 2 Batch C — modular Auth; AngularFirestore wasn't used.

@Component({
  selector: 'app-user-about',
  templateUrl: './user-about.component.html',
  styleUrls: ['./user-about.component.scss']
})
export class UserAboutComponent implements OnInit {
  currentUser: Utilisateur;
  views = 0;

  private auth = inject(Auth);

  constructor(public AuthSvc: AuthService, private userSvc: UserService) {}

  ngOnInit() {
    authState(this.auth).subscribe(user => {
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
