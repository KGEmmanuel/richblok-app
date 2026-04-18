import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AuthService } from '../../../../shared/services/auth.service';
import { Utilisateur } from '../../../../shared/entites/Utilisateur';
import { Auth, authState } from '@angular/fire/auth';
import { Storage, ref as storageRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { UserService } from '../../../../shared/services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import { Post } from 'src/app/shared/entites/Post';
import { Media } from 'src/app/shared/entites/Media';
import { ToastrService } from 'ngx-toastr';

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

  private auth = inject(Auth);
  private storage = inject(Storage);

  constructor(public AuthSvc: AuthService, private toassvc: ToastrService,
    private userSvc: UserService, private router: Router, private postSvc: PostService) {

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
    authState(this.auth).subscribe(user => {
      if (user) {
        this.userSvc.get(user.uid).subscribe(v => {
          this.currentUser = v;
        });
      }
    });
  }

  async upload(file) {
    const filePath = 'posts/' + this.currentUser.id + '/' + '_' + (new Date().getMilliseconds()) + file.name;
    const fileRef = storageRef(this.storage, filePath);
    try {
      await uploadBytes(fileRef, file);
      if (!this.currentPost.medias) {
        this.currentPost.medias = new Array<Media>();
      }
      const m = new Media();
      const ext: string = file.type;
      if (ext.toLowerCase().includes('image')) {
        m.mediatype = 'IMG';
      } else if (ext.toLowerCase().includes('video')) {
        m.mediatype = 'VID';
      } else if (ext.toLowerCase().includes('document')) {
        m.mediatype = 'DOC';
      }
      m.src = await getDownloadURL(fileRef);
      this.currentPost.medias.push(m);
    } catch (err: any) {
      this.toassvc.error('erreur d\'upload de fichier ' + err.message);
    }
  }


  uploadallFiles(files: File[]) {
    const allPromises: Promise<void>[] = [];
    files.forEach(el => {
      const filePath = 'posts/' + this.currentUser.id + '/' + '_' + (new Date().getMilliseconds()) + el.name;
      const fileRef = storageRef(this.storage, filePath);
      const p = uploadBytes(fileRef, el).then(() => getDownloadURL(fileRef)).then(url => {
        if (!this.currentPost.medias) {
          this.currentPost.medias = new Array<Media>();
        }
        const m = new Media();
        const ext: string = el.type;
        m.mediatype = 'IMG';
        if (ext.toLowerCase().includes('image')) {
          m.mediatype = 'IMG';
        } else if (ext.toLowerCase().includes('video')) {
          m.mediatype = 'VID';
        } else if (ext.toLowerCase().includes('document')) {
          m.mediatype = 'DOC';
        }
        m.src = url;
        this.currentPost.medias.push(m);
      });
      allPromises.push(p);
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
