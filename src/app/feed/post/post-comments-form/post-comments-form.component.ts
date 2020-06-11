<<<<<<< HEAD
=======
import { NgxUiLoaderService } from 'ngx-ui-loader';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
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
<<<<<<< HEAD
  constructor(private postSvc: PostService, private toasSvc: ToastrService) { }
=======
  constructor(private postSvc: PostService, private toasSvc: ToastrService, private loadSvc: NgxUiLoaderService) { }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

  ngOnInit(): void {
  }

  sendReply() {
<<<<<<< HEAD
    alert('sending reply');
=======
    this.loadSvc.start();
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    const commentaire = new Commentaire();
    commentaire.message = this.reply;
    commentaire.owner = this.currentUser.id;
    commentaire.parent = null;
    commentaire.date = new Date();
    this.postSvc.saveComment(this.postItem, null, commentaire).then(val => {
<<<<<<< HEAD
      this.toasSvc.success('Cool!!!', 'Comment successfuly sent...');
      this.reply = '';
    });
  }

=======
      this.loadSvc.stop();
      this.toasSvc.success('Comment successfuly sent...', 'Success');
      this.reply = '';
    });
  }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
}
