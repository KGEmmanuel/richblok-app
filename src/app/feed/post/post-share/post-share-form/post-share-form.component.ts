import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AuthService } from '../../../../shared/services/auth.service';
import { Utilisateur } from '../../../../shared/entites/Utilisateur';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../../../../shared/services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import * as firebase from 'firebase';
import { Post } from 'src/app/shared/entites/Post';
import { Media } from 'src/app/shared/entites/Media';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-post-share-form',
  templateUrl: './post-share-form.component.html',
  styleUrls: ['./post-share-form.component.scss']
})
export class PostShareFormComponent implements OnInit {
  location: boolean = false;
  currentUser: Utilisateur;
  urls = [];
  files: File[] = [];
  currentPost: Post = new Post();

  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth, private toassvc: ToastrService,
    private afs: AngularFirestore, private afStorage: AngularFireStorage, private userSvc: UserService, private router: Router, private postSvc: PostService) {

  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      // this.files.push(event.target.files);
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        console.log(event.target.files[0]);
        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);

        }
        this.files.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);
        //this.files.push(reader)
      }
    }
  }
  addLocation() {
    this.location = !this.location;
  }


  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v;
        });
      }
    });
  }

  async upload(file) {
    // const user = this.getcurrentuser();
    const filePath = 'posts/' + this.currentUser.id + '/' + '_' + (new Date().getMilliseconds()) + file.name;

    const fileRef = firebase.storage().ref(filePath);
    await fileRef.put(file).then(s => {

      if (!this.currentPost.medias) {
        this.currentPost.medias = new Array<Media>();
      }
      // mediatype: string; // VID, IMG, DOC, UNK
      const m = new Media();
      const ext: string = file.type;
      if (ext.toLowerCase().includes('image')) {
        m.mediatype = 'IMG';
      }
      else if (ext.toLowerCase().includes('video')) {
        m.mediatype = 'VID';
      }
      else if (ext.toLowerCase().includes('document')) {
        m.mediatype = 'DOC';
      }
      fileRef.getDownloadURL().then(v => {
        m.src = v;
        console.log('cool' + m);
        this.currentPost.medias.push(m);
        console.log(this.currentPost.medias);
      });

    }).catch(err => {
      this.toassvc.error('erreur d\'upload de fichier ' + err.message);
    });

  }


  uploadallFiles(files: File[]) {

    const allPromises = [];
    files.forEach(el => {
      const filePath = 'posts/' + this.currentUser.id + '/' + '_' + (new Date().getMilliseconds()) + el.name;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, el);
      allPromises.push(task);
      // allPercentage.push(_percentage$);

      // observe percentage changes
      // this.uploadPercent = task.percentageChanges();

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            if (!this.currentPost.medias) {
              this.currentPost.medias = new Array<Media>();
            }
            // mediatype: string; // VID, IMG, DOC, UNK
            const m = new Media();
            const ext: string = el.type;
            m.mediatype = 'IMG';
            if (ext.toLowerCase().includes('image')) {
              m.mediatype = 'IMG';
            }
            else if (ext.toLowerCase().includes('video')) {
              m.mediatype = 'VID';
            }
            else if (ext.toLowerCase().includes('document')) {
              m.mediatype = 'DOC';
            }
            m.src = url;
            this.currentPost.medias.push(m);
          });
        })
      ).subscribe();
      // this.downloadURLs.push(this.downloadURL);
    });
    return allPromises;
  }

  async savePost() {
    // alert('saving post');
    this.currentPost.abonnees = this.currentUser.abonnees;
    this.currentPost.abonnees.push(this.currentUser.id);
    this.currentPost.date = new Date();
    this.currentPost.owner = this.currentUser.id;
    this.currentPost.typePost = 'Publication';
    console.log(this.currentPost.medias);
    const filesAmount = this.files.length;
    Promise.all(this.uploadallFiles(this.files)).then(v => {
     // alert('test 1');
      console.log('Medias is ' + this.currentPost.medias)
      this.postSvc.savePost(this.currentPost).then(val => {

        this.currentPost = new Post();
        this.toassvc.success('Publication successfully saved');
      //  alert('test 2');
      }).catch(err => {
        this.toassvc.error('Error : ' + err.message);
      });
    })






  }


}
