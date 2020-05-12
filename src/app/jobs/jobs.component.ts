import { Component, OnInit } from '@angular/core';
import { OffreEmploiService } from '../shared/services/offre-emploi.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { SkillsService } from '../shared/services/skills.service';
import { Skill } from '../shared/entites/Skill';
import { OffresEmploi } from '../shared/entites/OffresEmploi';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  uid;
  skills: Array<Skill>
  JobsRelated : Array<OffresEmploi>;
  JobsCreated: Array<OffresEmploi>;

  constructor(private jobSvc: OffreEmploiService, private afAuth: AngularFireAuth, private skillSvc: SkillsService) { }

  ngOnInit() {
    
  }

}
