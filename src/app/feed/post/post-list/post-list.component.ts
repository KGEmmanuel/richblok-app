import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import { Post } from '../../../shared/entites/Post';
import { PaginationService } from '../../../shared/services/pagination.service';
import { PostService } from '../../../shared/services/post.service';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Observable } from 'rxjs';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [ PaginationService ]
})
export class PostListComponent implements OnInit {

  _displayfor = 'feed';
  allJobs: Array<OffresEmploi>;

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
  tags: Array<string>;
  users: Observable<Utilisateur[]>;

  constructor(private usvc: UtilisateurService,public page: PaginationService, private postSvc: PostService, private jobSvc: OffreEmploiService,) {

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
    this.jobSvc.offresByTag(this.tags).onSnapshot( jobs=> {
      this.allJobs = [];
      console.log(jobs);
        jobs.forEach(j=>{
          const job = j.data() as OffresEmploi;
          job.id = j.id;
          this.allJobs.push(job);
        });
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
