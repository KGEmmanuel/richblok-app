import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { Auth, authState } from '@angular/fire/auth';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

// D7 Day 2 Batch C — modular Auth. Firestore is unused here so the import
// can be dropped entirely (UserService encapsulates the profile read).

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
    authState(this.auth).subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v;
        });
      }
    });
    this.currentUser = new Utilisateur();
  }

  logout() { this.AuthSvc.SignOut(); }
  showOrgs() { this.organisations = !this.organisations; }
  feed()          { this.router.navigateByUrl('/me?tab=feed'); }
  messages()      { this.router.navigateByUrl('/messages'); }
  record()        { this.router.navigateByUrl('/me?tab=portfolio'); }
  demonstrate()   { this.router.navigateByUrl('/demonstrate'); }
  evaluate()      { this.router.navigateByUrl('/evaluate'); }
  jobs()          { this.router.navigateByUrl('/jobs'); }
  friends()       { this.router.navigateByUrl('/friends'); }
  notifications() { this.router.navigateByUrl('/notifications'); }
}
