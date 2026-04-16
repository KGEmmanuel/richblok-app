import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
import { Utilisateur } from '../../../shared/entites/Utilisateur';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../../shared/services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Post } from 'src/app/shared/entites/Post';
import { Media } from 'src/app/shared/entites/Media';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  location: boolean = false;
  currentUser: Utilisateur;
  urls = [];
  files: File[] = [];
  currentPost: Post = new Post();
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth, private toassvc: ToastrService,
    private afs: AngularFirestore, private afStorage: AngularFireStorage, private userSvc: UserService, private router: Router, private postSvc: PostService,
    private loadsvc: NgxUiLoaderService) {
  }
  removeItem(i){
    this.urls.splice(i, 1);
  }
  onSelectFile(event) {
    this.loadsvc.start();
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
      }

    }
    this.loadsvc.stop();
  }
  addLocation() {
    this.location = !this.location;
  }


 public handleAddressChange() {
        // Do some stuff
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
    if(!this.currentPost.description || !this.currentPost.location){
      this.toassvc.error('You must write something and give your actual location before posting', 'Error')
      return;
    }
    this.loadsvc.start();
    this.currentPost.abonnees = this.currentUser.abonnees;
    if(!this.currentUser.abonnees){
      this.currentPost.abonnees = [];
    }
    this.currentPost.abonnees.push(this.currentUser.id);
    this.currentPost.date = new Date();
    this.currentPost.owner = this.currentUser.id;
    this.currentPost.typePost = 'Publication';
    console.log(this.currentPost.medias);
    const filesAmount = this.files.length;
    Promise.all(this.uploadallFiles(this.files)).then(v => {
      console.log('Medias is ' + this.currentPost.medias)
      this.postSvc.savePost(this.currentPost).then(val => {
        this.loadsvc.stop();
        this.currentPost = new Post();
        this.toassvc.success('Publication successfully saved');
      }).catch(err => {
        this.loadsvc.stop();
        this.toassvc.error('Error : ' + err.message);
      });
    })






  }


}
