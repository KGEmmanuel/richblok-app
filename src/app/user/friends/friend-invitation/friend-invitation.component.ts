import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import * as firebase from 'firebase';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';

@Component({
  selector: 'app-friend-invitation',
  templateUrl: './friend-invitation.component.html',
  styleUrls: ['./friend-invitation.component.scss']
})
export class FriendInvitationComponent implements OnInit {
<<<<<<< HEAD
  currentUser: Utilisateur;
=======
  currentUser = new Utilisateur();
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  constructor(private userSvc: UtilisateurService) { }
  ngOnInit() {
    firebase.auth().onAuthStateChanged(v=>{
       this.userSvc.getDocRef(v.uid).onSnapshot(val=>{
          this.currentUser = val.data() as Utilisateur;
          this.currentUser.id = val.id;
          console.log(this.currentUser.demandesabonnees);
          // this.currentUser.demandesabonnees
       });
    });

  }
}
