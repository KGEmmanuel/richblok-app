import { Component, OnInit, Input, Self } from '@angular/core';
import { Commentaire } from '../../../shared/entites/Commentaire';
import { Utilisateur } from '../../../shared/entites/Utilisateur';
import { Post } from '../../../shared/entites/Post';
import { PostService } from '../../../shared/services/post.service';
import { PaginationService } from '../../../shared/services/pagination.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss'],
  providers: [ PaginationService ]
})
export class PostCommentsComponent implements OnInit {
  comments: Array<Commentaire>;
  @Input()
  currentUser: Utilisateur;
  reply: string;
  @Input() postItem: Post;
  constructor(public page: PaginationService, private postSvc: PostService, private toasSvc: ToastrService) { }

  ngOnInit(): void {
    if (this.postItem) {
      const path = this.postSvc.path + '/' + this.postItem.id + '/' + this.postSvc.commentPath;
      this.page.init(path, 'date');
    }
  }



  scrollHandler(e) {
    if (e === 'bottom') {
      this.page.more();
    }
  }

}
