import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Component, OnInit, Input } from '@angular/core';
import { Commentaire } from '../../../shared/entites/Commentaire';
import { Utilisateur } from '../../../shared/entites/Utilisateur';
import { Post } from '../../../shared/entites/Post';
import { PostService } from '../../../shared/services/post.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-comments-form',
  templateUrl: './post-comments-form.component.html',
  styleUrls: ['./post-comments-form.component.scss']
})
export class PostCommentsFormComponent implements OnInit {
  reply : string;
  @Input()
  currentUser: Utilisateur;
  @Input()
  postItem: Post;
  constructor(private postSvc: PostService, private toasSvc: ToastrService, private loadSvc: NgxUiLoaderService) { }

  ngOnInit(): void {
  }

  sendReply() {
    this.loadSvc.start();
    const commentaire = new Commentaire();
    commentaire.message = this.reply;
    commentaire.owner = this.currentUser.id;
    commentaire.parent = null;
    commentaire.date = new Date();
    this.postSvc.saveComment(this.postItem, null, commentaire).then(val => {
      this.loadSvc.stop();
      this.toasSvc.success('Comment successfuly sent...', 'Success');
      this.reply = '';
    });
  }
}
