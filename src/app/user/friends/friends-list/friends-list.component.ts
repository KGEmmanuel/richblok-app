import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {
  currentUser = new Utilisateur();

  private auth = inject(Auth);

  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {
    this.userSvc.initDatas();
    onAuthStateChanged(this.auth, v => {
      if (v) {
        this.userSvc.getDocRef(v.uid).onSnapshot(val => {
          this.currentUser = val.data() as Utilisateur;
          this.currentUser.id = val.id;
          console.log('abonnéés', this.currentUser.abonnees);
        });
      }
    });

  }

}
