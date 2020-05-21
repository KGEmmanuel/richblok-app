import { Utilisateur } from './../../../shared/entites/Utilisateur';
import { UtilisateurService } from './../../../shared/services/utilisateur.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Challenge } from 'src/app/shared/entites/Challenge';
import { Post } from 'src/app/shared/entites/Post';
import * as firebase from 'firebase';

@Component({
  selector: 'app-evaluate-item',
  templateUrl: './evaluate-item.component.html',
  styleUrls: ['./evaluate-item.component.scss']
})
export class EvaluateItemComponent implements OnInit {
  @Input()
  currentChal: Challenge;
  user: Utilisateur;
  detail = false;
  commentcount = 0;
  @Input()
  currentPost: Post;
  @Input()
  preview = false;
  showcomments = false;
  constructor(private router: Router,private usrSvc: UtilisateurService) { }


  ngOnInit() {
    if(this.currentChal.creatorRef){
        this.usrSvc.getDocRef(this.currentChal.creatorRef).onSnapshot(val=>{
          this.user = val.data() as Utilisateur;
          this.user.id= val.id;
        })
    }
  this.currentPost = new Post();
  }
  participate() {
    alert(this.currentChal.id)
    this.router.navigate(['participate-to-challenge', this.currentChal.id]);
}

  get hasliked(): boolean {
    return this.currentPost.userliked.includes(this.user?.id);
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
    this.currentPost.userliked.push(this.user.id);
    var dbref = db.collection('posts').doc(this.currentPost.id);
    dbref.update({
      userliked: firebase.firestore.FieldValue.arrayUnion(this.user.id)
    });
  }

  unlike() {
    const db = firebase.firestore();
    const idx = this.currentPost.userliked.indexOf(this.user.id);
    this.currentPost.userliked.splice(idx);
    // this.postItem.userliked.push(this.currentuser.id);
    var dbref = db.collection('posts').doc(this.currentPost.id);
    dbref.update({
      userliked: firebase.firestore.FieldValue.arrayRemove(this.user.id)
    });
  }

  tooglecomments(){
    this.showcomments = !this.showcomments;
   // alert( this.showcomments)
  }

}
