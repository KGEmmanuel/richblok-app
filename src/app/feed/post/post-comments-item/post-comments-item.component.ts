import { Component, OnInit, Input } from '@angular/core';
import { Commentaire } from '../../../shared/entites/Commentaire';
import { Utilisateur } from '../../../shared/entites/Utilisateur';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';

@Component({
  selector: 'app-post-comments-item',
  templateUrl: './post-comments-item.component.html',
  styleUrls: ['./post-comments-item.component.scss']
})
export class PostCommentsItemComponent implements OnInit {

  @Input()
  currentComment: Commentaire;
  ownedUser: Utilisateur;
  constructor(private userSvc: UtilisateurService) { }

  ngOnInit(): void {
    this.userSvc.getDocRef(this.currentComment.owner).onSnapshot(v => {
      this.ownedUser = v.data() as Utilisateur;
      this.ownedUser.id = v.id;
    });

  }

}
