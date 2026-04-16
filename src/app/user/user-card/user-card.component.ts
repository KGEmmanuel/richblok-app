import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../../shared/entites/Utilisateur';
import { AuthService } from '../../shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  currentUser: Utilisateur;
  views = 0;
  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private userSvc: UserService) {

  }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v;
          this.views = this.currentUser.visiteurs ? this.currentUser.visiteurs.length : 0;
        });
      }
    });

  }
}
