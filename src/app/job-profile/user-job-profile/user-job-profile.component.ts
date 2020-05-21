import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { OrganisationService } from 'src/app/shared/services/organisation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { switchMap } from 'rxjs/operators';
import { JobApplication } from 'src/app/shared/entites/JobApplication';
import { Skill } from 'src/app/shared/entites/Skill';
import { SkillsService } from 'src/app/shared/services/skills.service';
import { Formation } from 'src/app/shared/entites/Formation';
import { FormationService } from 'src/app/shared/services/formation.service';
import { Experience } from 'src/app/shared/entites/Experience';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-job-profile',
  templateUrl: './user-job-profile.component.html',
  styleUrls: ['./user-job-profile.component.scss']
})
export class UserJobProfileComponent implements OnInit {

  currentJob: OffresEmploi;
  org: Entreprise;
  user: Utilisateur;
  currentApplication = new JobApplication();
  step = 1;

  usersSkils: Array<Skill>;
  usersTraining: Array<Formation>;
  userExperiences: Array<Experience>;


  constructor(private route: ActivatedRoute, private jobSvc: OffreEmploiService, private orgSvc: OrganisationService,
    private userSvc: UtilisateurService, private skilSvc: SkillsService, private trainSvc: FormationService,
    private expSvc: ExperienceService, private JobApplicationSvc: JobApplicationService, private toastrSvc: ToastrService) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.jobSvc.getDocRef(id).onSnapshot(obj => {
        this.currentJob = obj.data() as OffresEmploi;
        this.currentJob.id = obj.id;

        if (this.currentJob.ownerOrg) {
          this.jobSvc.getDocRef(this.currentJob.ownerOrg).onSnapshot(or => {
            this.org = or.data() as Entreprise;
            this.org.id = or.id;
          })
        }
        if (this.currentJob.ownerUser) {
          this.userSvc.getDocRef(this.currentJob.ownerUser).onSnapshot(us => {
            this.user = us.data() as Utilisateur;
            this.user.id = us.id;
            this.skilSvc.getSkillsof(this.user.id).onSnapshot(all => {
              this.usersSkils = [];
              all.forEach(sk => {
                const s = sk.data() as Skill;
                s.id = sk.id;
                this.usersSkils.push(s);
              })
            })
            this.trainSvc.editableFormationsListQuery(this.user.id).onSnapshot(train => {
              this.usersTraining = [];
              train.forEach(t => {
                const tr = t.data() as Formation;
                tr.id = t.id;
                this.usersTraining.push(tr);
              })
            })
            this.expSvc.listExperiences(this.user.id).onSnapshot(exps => {
              this.userExperiences = [];
              exps.forEach(e => {
                const exp = e.data() as Experience;
                exp.id = e.id;
                this.userExperiences.push(exp);
              })
            })
          })
        }

      })
    });
  }

  next() {
    if (this.step < 4) {
      this.step++;
    }
  }

  prev() {
    if (this.step > 1) {
      this.step--;
    }
  }

  apply() {
    this.currentApplication.userRef = this.user.id;
    this.currentApplication.jobref = this.currentJob.id;
    this.JobApplicationSvc.add(this.currentApplication).then(v=>{
        this.toastrSvc.success('Successfully applied')
        this.currentApplication = new JobApplication();

    }).catch(err=>{
      this.toastrSvc.error('An Error occured',err.message)
    })
  }

  changed(event) {
    if(event.currentTarget.checked){
      this.currentApplication.skillsRef.push(event.currentTarget.value)
    }
    else{
      const index = this.currentApplication.skillsRef.indexOf(event.currentTarget.value, 0);
      if (index > -1) {
        this.currentApplication.skillsRef.splice(index, 1);
      }
    }
  }

  expchanged(event) {
    if(event.currentTarget.checked){
      this.currentApplication.exp.push(event.currentTarget.value)
    }
    else{
      const index = this.currentApplication.exp.indexOf(event.currentTarget.value, 0);
      if (index > -1) {
        this.currentApplication.exp.splice(index, 1);
      }
    }
  }

  trainchanged(event) {
    if(event.currentTarget.checked){
      this.currentApplication.trainings.push(event.currentTarget.value)
    }
    else{
      const index = this.currentApplication.trainings.indexOf(event.currentTarget.value, 0);
      if (index > -1) {
        this.currentApplication.trainings.splice(index, 1);
      }
    }
  }


}
