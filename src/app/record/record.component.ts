import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../shared/services/experience.service';
import { FormationService } from '../shared/services/formation.service';
import { LanguageService } from '../shared/services/language.service';
import { SkillsService } from '../shared/services/skills.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  nbreAccTrain = 0;
  nbreProTrain = 0;
  nbreSkill = 0;
  nbreLng = 0;
  nbreExp = 0;
  uid;
  constructor(private afAuth: AngularFireAuth, private expSvc: ExperienceService, private formSvc: FormationService, private lgSvc: LanguageService, private skilSvc: SkillsService) {

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
        this.formSvc.editableFormationsListQuery(this.uid,'ACC').onSnapshot(acc=>{
          this.nbreAccTrain = acc.size;
        });
        this.formSvc.editableFormationsListQuery(this.uid,'PRO').onSnapshot(pro=>{
          this.nbreProTrain = pro.size;
        });
        this.lgSvc.listLanguages(this.uid).onSnapshot(lg=>{
          this.nbreLng = lg.size;
        });
        this.skilSvc.getSkillsof(this.uid).onSnapshot(sk=>{
          this.nbreSkill = sk.size;
        });
        this.expSvc.listExperiences(this.uid).onSnapshot(ex=>{
          this.nbreExp = ex.size;
        });
      }
    })

  }

}
