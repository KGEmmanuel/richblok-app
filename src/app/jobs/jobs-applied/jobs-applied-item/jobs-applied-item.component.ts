import { Component, OnInit, Input } from '@angular/core';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { JobApplication } from 'src/app/shared/entites/JobApplication';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { OrganisationService } from 'src/app/shared/services/organisation.service';
import { SkillsService } from 'src/app/shared/services/skills.service';
import { getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-jobs-applied-item',
  templateUrl: './jobs-applied-item.component.html',
  styleUrls: ['./jobs-applied-item.component.scss']
})
export class JobsAppliedItemComponent implements OnInit {

  @Input()
  currentApplication: JobApplication;

  currentJob: OffresEmploi;

  user: Utilisateur;
  job: OffresEmploi;
  org: Entreprise;
  
  constructor(private jobSvc: OffreEmploiService, private userSvc: UtilisateurService, private skilsvc: SkillsService) { }

  ngOnInit(): void {

    if(this.currentApplication){
        this.jobSvc.getDocRef(this.currentApplication.jobref).onSnapshot(jb=>{
           this.currentJob = jb.data() as OffresEmploi;
           this.currentJob.id = jb.id;
        })
    }
    
  }

  getskilof(id: string){
    return getDoc(this.skilsvc.getSkill(this.currentApplication.userRef,id)).then(v=>{
      return v.data();
    }).catch(er=>{
       console.log(er);
    })
  }

}
