import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {
  currentUser = new Utilisateur();
  // users: Utilisateur[];

  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {
    this.userSvc.initDatas();
    // alert(firebase.auth().currentUser.uid);
    firebase.auth().onAuthStateChanged(v => {
      if (v) {
        this.userSvc.getDocRef(firebase.auth().currentUser?.uid).onSnapshot(val => {
          this.currentUser = val.data() as Utilisateur;
          this.currentUser.id = val.id;
          console.log('abonnéés', this.currentUser.abonnees);
        });
      }
    });

  }

}
