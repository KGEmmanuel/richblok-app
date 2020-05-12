import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import { Post } from '../../../shared/entites/Post';
import { PaginationService } from '../../../shared/services/pagination.service';
import { PostService } from '../../../shared/services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [ PaginationService ]
})
export class PostListComponent implements OnInit {

  _displayfor = 'feed';

  @Input()
  type;
  @Input()
  set displayFor(val) {
    this._displayfor = val;
    // this.loadposts();
  }
  get displayFor(): string {
    return this._displayfor;
  }

  @Input()
  relateduser;
  postitems: Post[];

  uid;
  keys: string[] = [];
  operator: firebase.firestore.WhereFilterOp[] = [];
  values: object[] = [];

  constructor(public page: PaginationService, private postSvc: PostService) {

  }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(v => {
      this.uid = v.uid;
      if (this.uid) {
        //  this.loadposts();
       // this.setdatas();
        this.setdatas();
        this.page.initWithFilter(this.postSvc.path, 'date', this.keys, this.operator, this.values, { reverse: true, prepend: false });
      }
    });
  }

  setdatas() {
    if (this.displayFor === 'feed') {
      this.keys.push('abonnees');
      this.operator.push('array-contains');
      this.values.push(this.uid);
      console.log('its me thats called');
    }
    if (this.displayFor === 'Me') {
      this.keys.push('owner');
      this.operator.push('==');
      this.values.push(this.uid);
    }
    if (this.displayFor === 'Public') {
      this.keys.push('owner');
      this.operator.push('==');
      this.values.push(this.relateduser);

    }
    if (this.type) {
      this.keys.push('typePost');
      this.operator.push('==');
      this.values.push(this.type);
    }
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      this.page.more();
    }

  }



}
