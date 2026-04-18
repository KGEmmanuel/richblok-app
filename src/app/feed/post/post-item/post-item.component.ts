import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Utilisateur } from '../../../shared/entites/Utilisateur';
import { Post } from '../../../shared/entites/Post';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PostService } from '../../../shared/services/post.service';
import { NgbPopoverConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  detail = false;
  commentcount = 0;

  ownedUser  = new Utilisateur();
  @Input()
  currentPost: Post;
  @Input()
  preview = false;
  currentuser: Utilisateur;
  showcomments = false;



  constructor(
    private userSvc: UtilisateurService,
    private afAuth: AngularFireAuth,
    private postSvc: PostService,
    private modalService: NgbModal,            // D2: share modal now opens via NgbModal
    config: NgbPopoverConfig
  ) {
    config.placement = 'right';
    config.triggers = 'hover';
    config.autoClose = 'outside';
    config.closeDelay = 1000000;
   }

  openShareModal(tpl: TemplateRef<any>) {
    this.modalService.open(tpl, { size: 'lg', ariaLabelledBy: 'post-share' });
  }

  ngOnInit() {

    this.afAuth.onAuthStateChanged(val => {
      if (val) {
        this.userSvc.getDocRef(val.uid).onSnapshot(u => {
          this.currentuser = u.data() as Utilisateur;
          this.currentuser.id = u.id;
        });
      }
    });

    if (this.currentPost) {
      if(this.currentPost?.owner)
      this.userSvc.getDocRef(this.currentPost?.owner).onSnapshot(val => {
        this.ownedUser = val.data() as Utilisateur;
        this.ownedUser.id = val.id;
      });
      if (this.currentPost.nbreComment) {
        this.commentcount = this.currentPost.nbreComment;
      } else {
        this.postSvc.getCommentsofPost(this.currentPost).onSnapshot(v => {
          this.commentcount = v.size;
        });
      }
    }

  }
  showDetail() {
    this.detail = true;
  }


  get hasliked(): boolean {
    return this.currentPost.userliked.includes(this.currentuser?.id);
  }

  get likedcount(): number {
    return this.currentPost.userliked.length;
  }

  tooglelike() {
    if (this.hasliked) {
      this.unlike();
    }
    else {
      this.like();
    }
  }

  like() {
    const db = firebase.firestore();
    this.currentPost.userliked.push(this.currentuser.id);
    var dbref = db.collection('posts').doc(this.currentPost.id);
    dbref.update({
      userliked: firebase.firestore.FieldValue.arrayUnion(this.currentuser.id)
    });
  }

  unlike() {
    const db = firebase.firestore();
    const idx = this.currentPost.userliked.indexOf(this.currentuser.id);
    this.currentPost.userliked.splice(idx);
    // this.postItem.userliked.push(this.currentuser.id);
    var dbref = db.collection('posts').doc(this.currentPost.id);
    dbref.update({
      userliked: firebase.firestore.FieldValue.arrayRemove(this.currentuser.id)
    });
  }

  tooglecomments(){
    this.showcomments = !this.showcomments;
   // alert( this.showcomments)
  }

}
