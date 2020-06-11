import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Output()
  itemEdited = new EventEmitter<Skill>();
  @Input()
  currentSkill: Skill;
  @Input()
  userid: string;
  constructor( private skilSvc: SkillsService,
    private toasterSvc: ToastrService) { }

  ngOnInit() {
  }

  delete(){
    const b = confirm('Do you realy want to delete this item?')
    if(b){
    this.skilSvc.delete(this.userid,this.currentSkill.id)
    }
  }
  edit(){
    this.itemEdited.emit(this.currentSkill);
  }

}
