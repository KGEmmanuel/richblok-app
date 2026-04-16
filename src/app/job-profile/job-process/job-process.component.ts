import { Component, OnInit } from '@angular/core';
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
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-job-process',
  templateUrl: './job-process.component.html',
  styleUrls: ['./job-process.component.scss']
})
export class JobProcessComponent implements OnInit {
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  currentJob = new OffresEmploi();
  org: Entreprise;
  user: Utilisateur;
  currentApplication = new JobApplication();
  usersSkils: Array<Skill>;
  usersTraining: Array<Formation>;
  userExperiences: Array<Experience>;
  currentUser: Utilisateur;
  apply = true;
  sorting = true;
  scoring = true;
  purposes = true;
  recruited = true;
  back = true;
  ap = false;
  so = false;
  sc = false;
  pu = false;
  re = false;


  constructor(private route: ActivatedRoute, private jobSvc: OffreEmploiService, private orgSvc: OrganisationService,private loadingSvc: NgxUiLoaderService,
    private userSvc: UtilisateurService, private skilSvc: SkillsService, private trainSvc: FormationService,
    private expSvc: ExperienceService, private JobApplicationSvc: JobApplicationService, private toastrSvc: ToastrService,
    private afAuth: AngularFireAuth) { }

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
          })
        }
        this.afAuth.onAuthStateChanged(val => {
          if (val) {
            this.userSvc.getDocRef(val.uid).onSnapshot(u => {
              this.currentUser = u.data() as Utilisateur;
              this.currentUser.id = u.id;
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
  dispApply(){
    this.apply = true;
    this.sorting = false;
    this.scoring = false;
    this.purposes = false;
    this.recruited = false;
    this.back = true;
    this.ap = true;
    this.back = false;
    this.so = false;
    this.sc = false;
    this.pu = false;
    this.re = false;
  }
  dispSorting(){
    this.sorting = true;
    this.scoring = false;
    this.purposes = false;
    this.recruited = false;
    this.back = true;
    this.so = true
    this.back = false;
    this.ap = false;
    this.sc = false;
    this.pu = false;
    this.re = false;
  }
  dispScoring(){
    this.scoring = true;
    this.purposes = false;
    this.recruited = false;
    this.back = true;
    this.sc = true;
    this.back = false;
    this.ap = false;
    this.so = false;
    this.pu = false;
    this.re = false;
  }
  dispPurposes(){
    this.purposes = true;
    this.recruited = false;
    this.back = true;
    this.pu = true;
    this.back = false;
    this.ap = false;
    this.so = false;
    this.sc = false;
    this.re = false;
  }
  dispRecruited(){
    this.recruited = true;
    this.back = true;
    this.re = true;
    this.back = false;
    this.ap = false;
    this.so = false;
    this.sc = false;
    this.pu = false;
  }
  retour(){
    this.recruited = true;
    this.sorting = true;
    this.scoring = true;
    this.apply = true;
    this.purposes = true;
    this.back = true;
    this.ap = false;
    this.so = false;
    this.sc = false;
    this.pu = false;
    this.re = false;

  }
}
