import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { AuthService } from '../shared/services/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Title, Meta } from '@angular/platform-browser';

// D7 Day 2 Batch C — modular Auth; AngularFirestore was unused, UserService
// not referenced (imported but never injected originally).

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  currentUser: Utilisateur;
  visiteduser: Utilisateur;
  views = 0;

  private auth = inject(Auth);

  constructor(public AuthSvc: AuthService, private userSvc: UtilisateurService, private route: ActivatedRoute,
    private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('RichBlok | Profile');
    this.meta.updateTag({ name: 'description', content: 'Get access to your RichBlok profile' });
    this.route.params.subscribe(routeParams => {
      const id = routeParams.id;
      this.userSvc.get(id).subscribe(v => {
        this.currentUser = v;

        authState(this.auth).subscribe(user => {
          if (user) {
            if (!this.currentUser.visiteurs) {
              this.currentUser.visiteurs = [];
            }
            if (!this.currentUser.visiteurs.includes(user.uid)) {
              this.currentUser.visiteurs.push(user.uid);
              this.userSvc.update(this.currentUser.id, { visiteurs: this.currentUser.visiteurs });
            }
          }
        });
        this.views = this.currentUser.visiteurs ? this.currentUser.visiteurs.length : 0;
      });
    });
    this.currentUser = new Utilisateur();
  }

  logout() {
    this.AuthSvc.SignOut();
  }
}
