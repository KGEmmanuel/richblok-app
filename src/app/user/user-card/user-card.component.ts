import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from '../../shared/entites/Utilisateur';
import { AuthService } from '../../shared/services/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { UserService } from '../../shared/services/user.service';

// D7 Day 2 Batch C — modular Auth; AngularFirestore wasn't actually used.

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
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
