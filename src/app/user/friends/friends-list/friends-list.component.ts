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
<<<<<<< HEAD
  currentUser: Utilisateur;
=======
  currentUser = new Utilisateur();
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  // users: Utilisateur[];

  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {
    this.userSvc.initDatas();
    // alert(firebase.auth().currentUser.uid);
<<<<<<< HEAD
    this.userSvc.getDocRef(firebase.auth().currentUser.uid).onSnapshot(val => {
=======
    this.userSvc.getDocRef(firebase.auth().currentUser?.uid).onSnapshot(val => {
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
      this.currentUser = val.data() as Utilisateur;
      this.currentUser.id = val.id;
      // console.log(this.currentUser.abonnees);
    });
  }

}
