import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
// D7 Day 2 Batch C — firestore still compat because UserService.get() returns
// a compat Observable. Safe to leave until UserService migrates in Day 3.

@Component({
  selector: 'app-follow-orgs',
  templateUrl: './follow-orgs.component.html',
  styleUrls: ['./follow-orgs.component.scss']
})
export class FollowOrgsComponent implements OnInit {
  organisations: boolean = false;
  currentUser: Utilisateur;

  private auth = inject(Auth);

  constructor(public AuthSvc: AuthService, private userSvc: UserService, private router: Router) {}

  ngOnInit() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v;
        });
      }
    });
    this.currentUser = new Utilisateur();
  }
}
