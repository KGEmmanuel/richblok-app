<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
=======
import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { OffreEmploiService } from '../shared/services/offre-emploi.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { SkillsService } from '../shared/services/skills.service';
import { Skill } from '../shared/entites/Skill';
import { OffresEmploi } from '../shared/entites/OffresEmploi';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { UtilisateurService } from '../shared/services/utilisateur.service';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

<<<<<<< HEAD
  constructor() { }

  ngOnInit() {
=======
  uid;
  skills: Array<Skill>
  JobsRelated : Array<OffresEmploi>;
  JobsCreated: Array<OffresEmploi>;
  allJobs: Array<OffresEmploi>;
  savedJobs: Array<OffresEmploi>;
  tags: Array<string>;
  currentuser: Utilisateur;

  constructor(private jobSvc: OffreEmploiService, private afAuth: AngularFireAuth, private skillSvc: SkillsService,
              private userSvc: UtilisateurService, private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Jobs');
    this.meta.updateTag({ name: 'description', content: 'Have access to your desired job and apply for the job' });
    this.jobSvc.offresByTag(this.tags).onSnapshot( jobs=> {
      this.allJobs = [];
      console.log(jobs);
        jobs.forEach(j=>{
          const job = j.data() as OffresEmploi;
          job.id = j.id;
          this.allJobs.push(job);
        });
    });
    this.afAuth.auth.onAuthStateChanged(v=>{
      if(v){
        this.userSvc.getDocRef(v.uid).onSnapshot(u=>{
          this.currentuser = u.data() as Utilisateur;
          this.currentuser.id = u.id;
          this.savedJobs = [];
          if(this.currentuser.savedJobs){
          this.currentuser.savedJobs.forEach(jId=>{
            this.jobSvc.getDocRef(jId).onSnapshot(jb=>{
               const job = jb.data() as OffresEmploi;
               job.id = jb.id;
               this.savedJobs.push(job);
            })
          })}
        })
      }
    })


>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

}
