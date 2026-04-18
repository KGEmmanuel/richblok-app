import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { Auth, authState } from '@angular/fire/auth';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

// Week 4 — IA tightening:
//  - /demonstrate is dead; method + nav item removed.
//  - /search is dead; the hollow search bar is dropped.
//  - Talent dropdown surfaces /ai-native + /leaderboard.
//  - Employer dashboard link is gated on `currentUser.typeCompte`.

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  organisations: boolean = false;
  currentUser: Utilisateur;

  private auth = inject(Auth);

  constructor(public AuthSvc: AuthService, private userSvc: UserService, private router: Router) {}

  ngOnInit() {
    this.currentUser = new Utilisateur();
    authState(this.auth).subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v || new Utilisateur();
        });
      }
    });
  }

  /** True when the signed-in user has opted into the employer surface. */
  get isEmployer(): boolean {
    return this.currentUser?.typeCompte === 'employer';
  }

  logout() { this.AuthSvc.SignOut(); }
  showOrgs() { this.organisations = !this.organisations; }
  feed()          { this.router.navigateByUrl('/me?tab=feed'); }
  messages()      { this.router.navigateByUrl('/messages'); }
  record()        { this.router.navigateByUrl('/me?tab=portfolio'); }
  evaluate()      { this.router.navigateByUrl('/evaluate'); }
  jobs()          { this.router.navigateByUrl('/jobs'); }
  friends()       { this.router.navigateByUrl('/friends'); }
  notifications() { this.router.navigateByUrl('/notifications'); }
}
