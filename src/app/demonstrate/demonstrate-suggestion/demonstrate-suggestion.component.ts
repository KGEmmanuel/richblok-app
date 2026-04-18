import { Component, OnInit, inject } from '@angular/core';
import { Incitation } from 'src/app/shared/entites/Incitation';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { SkillsService } from 'src/app/shared/services/skills.service';
import { FormationService } from 'src/app/shared/services/formation.service';
import { Skill } from 'src/app/shared/entites/Skill';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-demonstrate-suggestion',
  templateUrl: './demonstrate-suggestion.component.html',
  styleUrls: ['./demonstrate-suggestion.component.scss']
})
export class DemonstrateSuggestionComponent implements OnInit {

  
  incitations = new Array<Incitation>();



  private auth = inject(Auth);

  constructor(private sksvc: SkillsService, private expSvc: ExperienceService, private formSvc: FormationService) { }

  ngOnInit() {

    onAuthStateChanged(this.auth, val => {
      if (!val) { return; }
      const userid = val.uid;
      this.sksvc.getSkillsof(userid).onSnapshot(skl => {
        this.incitations = [];
        skl.forEach(sk => {
          const skil = sk.data() as Skill;
          skil.id = sk.id;
          const inc = new Incitation();
          inc.creatorid = userid;
          inc.details =  'make demonstration to show us how you managed it ';
          inc.typeFor = 'CO';
          inc.relatedItem = skil.id;
          inc.titre = 'You have recorded skill : <span> <strong>' + skil.skillName + '(' + skil.skillStringValue + ').</strong></span>';
          this.incitations.push(inc);
        });
      });
    });
  }


}
