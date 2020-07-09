import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../../shared/entites/Post';
import { Utilisateur } from '../../../shared/entites/Utilisateur';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';

@Component({
  selector: 'app-user-post-item',
  templateUrl: './user-post-item.component.html',
  styleUrls: ['./user-post-item.component.scss']
})
export class UserPostItemComponent implements OnInit {
  ownedUser: Utilisateur;
  @Input()
  currentPost: Post;
  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {
    if (this.currentPost) {
      this.userSvc.getDocRef(this.currentPost?.owner).onSnapshot(val => {
        this.ownedUser = val.data() as Utilisateur;
        this.ownedUser.id = val.id;
      });
    }

  }

}
