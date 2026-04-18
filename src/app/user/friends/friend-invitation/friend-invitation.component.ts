import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';

@Component({
  selector: 'app-friend-invitation',
  templateUrl: './friend-invitation.component.html',
  styleUrls: ['./friend-invitation.component.scss']
})
export class FriendInvitationComponent implements OnInit {
  currentUser = new Utilisateur();

  private auth = inject(Auth);

  constructor(private userSvc: UtilisateurService) { }
  ngOnInit() {
    onAuthStateChanged(this.auth, v => {
      if (!v) { return; }
      this.userSvc.getDocRef(v.uid).onSnapshot(val => {
        this.currentUser = val.data() as Utilisateur;
        this.currentUser.id = val.id;
        console.log(this.currentUser.demandesabonnees);
      });
    });

  }
}
