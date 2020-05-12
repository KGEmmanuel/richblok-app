import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { Skill } from '../../../shared/entites/Skill';
import { SkillsService } from '../../../shared/services/skills.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-record-skills-item',
  templateUrl: './record-skills-item.component.html',
  styleUrls: ['./record-skills-item.component.scss']
})
export class RecordSkillsItemComponent implements OnInit {
  itemEdited = new EventEmitter<Skill>();
  @Input()
  currentSkill: Skill;
  @Input()
  userid: string;
  constructor( private skilSvc: SkillsService,
    private toasterSvc: ToastrService) { }

  ngOnInit() {
  }
  delete() {
    this.skilSvc.delete(this.userid, this.currentSkill.id).then(val => {
      this.toasterSvc.success('Skill removed');
    }).catch(err => {
      this.toasterSvc.error('An Error occured : ' + err.message);
    });
  }
  edit(){
    //alert('edit');
    this.itemEdited.emit(this.currentSkill);
  }

}
