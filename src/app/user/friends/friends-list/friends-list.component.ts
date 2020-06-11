import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import * as firebase from 'firebase';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {
  currentUser: Utilisateur;
  // users: Utilisateur[];

  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {
    this.userSvc.initDatas();
    // alert(firebase.auth().currentUser.uid);
    this.userSvc.getDocRef(firebase.auth().currentUser.uid).onSnapshot(val => {
      this.currentUser = val.data() as Utilisateur;
      this.currentUser.id = val.id;
      // console.log(this.currentUser.abonnees);
    });
  }

}
