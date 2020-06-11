import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { AuthService } from '../shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../shared/services/user.service';
<<<<<<< HEAD
=======
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Title, Meta } from '@angular/platform-browser';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  currentUser: Utilisateur;
<<<<<<< HEAD
  views = 0;
  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private userSvc: UserService) {
=======
  visiteduser: Utilisateur;
  views = 0;
  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private userSvc: UtilisateurService, private route: ActivatedRoute,
    private title: Title, private meta : Meta) {
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

  }

  ngOnInit() {
<<<<<<< HEAD

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
=======
    this.title.setTitle('RichBlok | Profile');
    this.meta.updateTag({ name: 'description', content: 'Get access to your RichBlok profile' });
    this.route.params.subscribe(routeParams => {
      const id = routeParams.id;
      this.userSvc.get(id).subscribe(v => {
        this.currentUser = v;

        this.afAuth.authState.subscribe(user => {
          if (user) {
            if(!this.currentUser.visiteurs){
              this.currentUser.visiteurs = [];
            }
            if(!this.currentUser.visiteurs.includes(user.uid)){
              this.currentUser.visiteurs.push(user.uid);
                this.userSvc.update(this.currentUser.id,{visiteurs:this.currentUser.visiteurs});
            }
          }
        });
        this.views = this.currentUser.visiteurs ? this.currentUser.visiteurs.length : 0;
      });
    });
/*
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {

>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
          this.currentUser = v;
          this.views = this.currentUser.visiteurs ? this.currentUser.visiteurs.length : 0;
        });
      }
    });
<<<<<<< HEAD
=======
    this.currentUser = new Utilisateur();*/
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    this.currentUser = new Utilisateur();
  }
}
