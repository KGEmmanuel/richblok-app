import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Commentaire } from '../entites/Commentaire';
import { Post } from '../entites/Post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  db: firebase.firestore.Firestore;
  readonly path = 'posts';
  readonly commentPath = 'commentaires';
  constructor() {
    this.db = firebase.firestore();
  }

  getOwnPostOf(id, type?) {
    // alert('getting own');
    if (type) {
      return this.db.collection(this.path).where('owner', '==', id).where('typePost', '==', type)
        .orderBy('date', 'desc');
    } else {
      return this.db.collection(this.path).where('owner', '==', id)
        .orderBy('date', 'desc');
    }

  }

  getRelatedPostOf(id) {
    // alert('related of ' + id);
    return this.db.collection(this.path).where('abonnees', 'array-contains', id)
      .orderBy('date', 'desc');
  }

  savePost(post: Post) {
    const chem = this.path;
    console.log(post.medias);
    post.date = new Date();
    const medias = [];
    if (post.medias) {
      post.medias.forEach(v => {
        medias.push(Object.assign({}, v));
      });
      // medias.push()
      post.medias = medias;
    }
    return this.db.collection(chem).add(Object.assign({}, post));
  }

  saveComment(post: Post, parent: Commentaire, commentaire: Commentaire) {
    const chem = this.path + '/' + post.id + '/' + this.commentPath;
    commentaire.parent = parent ? parent.id : null;
    return this.db.collection(chem).add(Object.assign({}, commentaire));
  }

  deleteComment(commentaire: Commentaire, post: Post) {
    if (confirm('Do you realy want to delete this comment?')) {
      const chem = this.path + '/' + post.id + '/' + this.commentPath;
      return this.db.doc(`${chem}/${commentaire.id}`).delete();
    }

  }


  getCommentsofPost(post: Post) {
    const chem = this.path + '/' + post.id + '/' + this.commentPath;
    return this.db.collection(chem).where('parent', '==', null).orderBy('date', 'desc');
  }

  getReply(comm: Commentaire, post: Post) {
    const chem = this.path + '/' + post.id + '/' + this.commentPath;
    // alert()
    return this.db.collection(chem).where('parent', '==', comm.id).orderBy('date', 'desc');
  }




}
