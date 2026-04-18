import { Injectable, inject } from '@angular/core';
import {
  Firestore, addDoc, collection, deleteDoc, doc, orderBy, query, where
} from '@angular/fire/firestore';
import { Commentaire } from '../entites/Commentaire';
import { Post } from '../entites/Post';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  readonly path = 'posts';
  readonly commentPath = 'commentaires';

  private firestore = inject(Firestore);

  constructor() {
  }

  private postsCol() {
    return collection(this.firestore, this.path);
  }

  private commentsCol(postId: string) {
    return collection(this.firestore, this.path, postId, this.commentPath);
  }

  getOwnPostOf(id: string, type?: string) {
    const base = this.postsCol();
    const q = type
      ? query(base, where('owner', '==', id), where('typePost', '==', type), orderBy('date', 'desc'))
      : query(base, where('owner', '==', id), orderBy('date', 'desc'));
    return snapshotQuery(q);
  }

  getRelatedPostOf(id: string) {
    return snapshotQuery(
      query(this.postsCol(), where('abonnees', 'array-contains', id), orderBy('date', 'desc'))
    );
  }

  savePost(post: Post) {
    console.log(post.medias);
    post.date = new Date();
    const medias = [];
    if (post.medias) {
      post.medias.forEach(v => {
        medias.push(Object.assign({}, v));
      });
      post.medias = medias;
    }
    return addDoc(this.postsCol(), Object.assign({}, post));
  }

  saveComment(post: Post, parent: Commentaire, commentaire: Commentaire) {
    commentaire.parent = parent ? parent.id : null;
    return addDoc(this.commentsCol(post.id), Object.assign({}, commentaire));
  }

  deleteComment(commentaire: Commentaire, post: Post) {
    if (confirm('Do you realy want to delete this comment?')) {
      return deleteDoc(doc(this.firestore, this.path, post.id, this.commentPath, commentaire.id));
    }
  }


  getCommentsofPost(post: Post) {
    return snapshotQuery(
      query(this.commentsCol(post.id), where('parent', '==', null), orderBy('date', 'desc'))
    );
  }

  getReply(comm: Commentaire, post: Post) {
    return snapshotQuery(
      query(this.commentsCol(post.id), where('parent', '==', comm.id), orderBy('date', 'desc'))
    );
  }




}
