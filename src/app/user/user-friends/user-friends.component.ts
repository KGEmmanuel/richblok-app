import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';

// D7 Day 2 Batch C — modular Auth; AngularFirestore unused.

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.scss']
})
export class UserFriendsComponent implements OnInit {
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
  }
}
