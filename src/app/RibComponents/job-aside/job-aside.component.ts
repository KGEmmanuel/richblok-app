import { Component, OnInit } from '@angular/core';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SkillsService } from '../../shared/services/skills.service';
import { Skill } from '../../shared/entites/Skill';
import { OffresEmploi } from '../../shared/entites/OffresEmploi';
import { Utilisateur } from '../../shared/entites/Utilisateur';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { JobsItemComponent } from 'src/app/jobs/jobs-item/jobs-item.component';

@Component({
  selector: 'app-job-aside',
  standalone: true,
  imports: [CommonModule, JobsItemComponent],
  templateUrl: './job-aside.component.html',
  styleUrls: ['./job-aside.component.scss']
})
export class JobAsideComponent implements OnInit {

  uid;
  skills: Array<Skill>
  JobsRelated : Array<OffresEmploi>;
  JobsCreated: Array<OffresEmploi>;
  allJobs: Array<OffresEmploi>;
  savedJobs: Array<OffresEmploi>;
  tags: Array<string>;
  currentuser: Utilisateur;

  constructor(private jobSvc: OffreEmploiService, private afAuth: AngularFireAuth, private skillSvc: SkillsService, private userSvc: UtilisateurService) { }

  ngOnInit() {
    this.jobSvc.offresByTag(this.tags).onSnapshot( jobs=> {
      this.allJobs = [];
      console.log(jobs);
        jobs.forEach(j=>{
          const job = j.data() as OffresEmploi;
          job.id = j.id;
          this.allJobs.push(job);
        });
    });
    this.afAuth.onAuthStateChanged(v=>{
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


  }

}
