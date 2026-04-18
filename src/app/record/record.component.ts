import { Component, OnInit , inject } from '@angular/core';
import { ExperienceService } from '../shared/services/experience.service';
import { FormationService } from '../shared/services/formation.service';
import { LanguageService } from '../shared/services/language.service';
import { SkillsService } from '../shared/services/skills.service';
import { Auth, authState } from '@angular/fire/auth';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);

  nbreAccTrain = 0;
  nbreProTrain = 0;
  nbreSkill = 0;
  nbreLng = 0;
  nbreExp = 0;
  nbreDoc = 0;
  uid;
  constructor(private expSvc: ExperienceService, private formSvc: FormationService, private lgSvc: LanguageService, private skilSvc: SkillsService,
    private title: Title,
    private meta: Meta) {

  }

  ngOnInit() {
    this.title.setTitle('RichBlok | Records');
    this.meta.updateTag({ name: 'description', content: 'Make a record or your skills, experiences, trainings and realisations' });
    authState(this.auth).subscribe(v => {
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
