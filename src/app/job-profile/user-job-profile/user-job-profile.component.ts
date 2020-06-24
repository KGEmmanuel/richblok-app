import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AngularFireAuth } from '@angular/fire/auth';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  dispApply = true;
  dispProcess= false;
  dispSav = true;
  currentUser: Utilisateur;


  constructor(private route: ActivatedRoute, private jobSvc: OffreEmploiService, private orgSvc: OrganisationService,private loadingSvc: NgxUiLoaderService,
    private userSvc: UtilisateurService, private skilSvc: SkillsService, private trainSvc: FormationService,
    private expSvc: ExperienceService, private JobApplicationSvc: JobApplicationService, private toastrSvc: ToastrService,
    private afAuth: AngularFireAuth, private router: Router, private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Job-profile');
    this.meta.updateTag({ name: 'description', content: 'Have detailed details on the job before you apply' });
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
          })
        }
        this.afAuth.auth.onAuthStateChanged(val => {
          if (val) {
            this.userSvc.getDocRef(val.uid).onSnapshot(u => {
              this.currentUser = u.data() as Utilisateur;
              this.currentUser.id = u.id;
              this.checkDispApply();
              this.dispSav = !this.currentUser.savedJobs?.includes(id);
              console.log(this.currentUser.savedJobs);
              this.skilSvc.getSkillsof(this.currentUser.id).onSnapshot(all => {
                this.usersSkils = [];
                all.forEach(sk => {
                  const s = sk.data() as Skill;
                  s.id = sk.id;
                  this.usersSkils.push(s);
                })
              })
              this.trainSvc.editableFormationsListQuery(this.currentUser.id).onSnapshot(train => {
                this.usersTraining = [];
                train.forEach(t => {
                  const tr = t.data() as Formation;
                  tr.id = t.id;
                  this.usersTraining.push(tr);
                })
              })
              this.expSvc.listExperiences(this.currentUser.id).onSnapshot(exps => {
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
      })
    });
  }

  next() {
    if (this.step < 6) {
      this.step++;
    }
  }

  prev() {
    if (this.step > 1) {
      this.step--;
    }
  }

  apply() {
    this.loadingSvc.start();
    this.currentApplication.userRef = this.currentUser.id;
    this.currentApplication.jobref = this.currentJob.id;
    this.JobApplicationSvc.add(this.currentApplication).then(v => {
      this.toastrSvc.success('Successfully applied')
      this.currentApplication = new JobApplication();
      this.loadingSvc.stop();
    }).catch(err => {
      this.loadingSvc.stop();
      this.toastrSvc.error('An Error occured', err.message)

    })
  }

  changed(event) {
    if (event.currentTarget.checked) {
      this.currentApplication.skillsRef.push(event.currentTarget.value)
    }
    else {
      const index = this.currentApplication.skillsRef.indexOf(event.currentTarget.value, 0);
      if (index > -1) {
        this.currentApplication.skillsRef.splice(index, 1);
      }
    }
  }

  expchanged(event) {
    if (event.currentTarget.checked) {
      this.currentApplication.exp.push(event.currentTarget.value)
    }
    else {
      const index = this.currentApplication.exp.indexOf(event.currentTarget.value, 0);
      if (index > -1) {
        this.currentApplication.exp.splice(index, 1);
      }
    }
  }

  trainchanged(event) {
    if (event.currentTarget.checked) {
      this.currentApplication.trainings.push(event.currentTarget.value)
    }
    else {
      const index = this.currentApplication.trainings.indexOf(event.currentTarget.value, 0);
      if (index > -1) {
        this.currentApplication.trainings.splice(index, 1);
      }
    }
  }

  checkDispApply() {
   // alert(this.currentJob.ownerUser + '    ' + this.user.id)
    if (this.currentJob.ownerUser) {
      if (this.currentUser.id === this.currentJob.ownerUser) {
        this.dispApply = false;
      }
    }
    this.JobApplicationSvc.findByfilters(['userRef', 'jobref'], ["==", "=="], [this.currentUser.id, this.currentJob.id]).snapshotChanges().subscribe(val => {
      if (val.length >0) {
        this.dispApply = false;
      }
    })
  }

  save(){
    this.loadingSvc.start()
    this.userSvc.saveJob(this.currentUser.id,this.currentJob.id).then(t=>{
      this.loadingSvc.stop()
      this.toastrSvc.success('Job offer succefully saved', 'Success');
    }).catch(err=>{
       this.toastrSvc.error('An error occured'+err.message);
    }).finally(()=>{
      this.loadingSvc.stop();
    })
  }


  navToViewProcess(){
   // alert('Test');
    this.router.navigate(['post-jobs',{id:this.currentJob.id}]);
  }
}
