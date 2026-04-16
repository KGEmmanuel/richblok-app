import { PortfolioService } from './../shared/services/portfolio.service';
import { RealisationService } from './../shared/services/realisation.service';
import { Realisation } from './../shared/entites/Realisation';
import { SkillsService } from './../shared/services/skills.service';
import { Skill } from './../shared/entites/Skill';
import { FormationService } from './../shared/services/formation.service';
import { Formation } from './../shared/entites/Formation';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { AuthService } from '../shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Title, Meta } from '@angular/platform-browser';
import { ExperienceService } from '../shared/services/experience.service';
import { Experience } from '../shared/entites/Experience';
import { SeoService } from '../shared/services/seo.service';
@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  currentUser: Utilisateur;
  visiteduser: Utilisateur;
  views = 0;
  experiences = new Array<Experience>();
  trainings = new Array<Formation>();
  skills = new Array<Skill>();
  realisations = new Array<Realisation>();
  showexp: number;
  showfrm: number;

  constructor(public AuthSvc: AuthService, private afAuth: AngularFireAuth,
              private afs: AngularFirestore, private userSvc: UtilisateurService, private route: ActivatedRoute,
              private title: Title, private meta : Meta,
              private expSvc: ExperienceService, private trainSvc: FormationService,
              private skillSvc: SkillsService, private realSvc: PortfolioService,
              private seo: SeoService) {

  }
  form = false;
  uid;

  ngOnInit() {

    this.route.params.subscribe(routeParams => {
      const id = routeParams.id;
      this.userSvc.get(id).subscribe(v => {
        this.currentUser = v;
        this.seo.setProfileTags(this.currentUser, id);
        this.expSvc.listExperiences(this.currentUser.id).onSnapshot(val => {
          this.experiences = [];
          val.forEach(element => {
            const ex = element.data() as Experience;
            ex.id = element.id;
            this.experiences.push(ex);
          });
        });
        this.trainSvc.editableFormationsListQuery(this.currentUser.id).onSnapshot(val => {
          this.trainings = [];
          val.forEach(element => {
            const tr = element.data() as Formation;
            tr.id = element.id;
            this.trainings.push(tr);
          });
        });
        this.skillSvc.getSkillsof(this.currentUser.id).onSnapshot(val => {
          this.skills = [];
          val.forEach(element => {
            const sk = element.data() as Skill;
            sk.id = element.id;
            this.skills.push(sk);
          });
        });
        this.realSvc.getportfolios(this.currentUser.id).onSnapshot(val => {
          this.realisations = [];
          val.forEach(element => {
            const rl = element.data() as Realisation;
            rl.id = element.id;
            this.realisations.push(rl);
          });
        });
        this.afAuth.authState.subscribe(user => {
          if (user) {
            if(!this.currentUser.visiteurs){
              this.currentUser.visiteurs = [];
            }
            if(!this.currentUser.visiteurs.includes(user.uid)){
              this.currentUser.visiteurs.push(user.uid);
              this.userSvc.update(this.currentUser.id,{visiteurs:this.currentUser.visiteurs});
            }
          }
        });
        this.views = this.currentUser.visiteurs ? this.currentUser.visiteurs.length : 0;
      });
    });
    this.showexp = 2;
    this.showfrm = 2;
  }
moreExp(){
  this.showexp += 2;
}
hidexp(){
  this.showexp = 2;
}
moreFrm(){
  this.showfrm += 2;
}
hideFrm(){
  this.showfrm = 2;
}
}
