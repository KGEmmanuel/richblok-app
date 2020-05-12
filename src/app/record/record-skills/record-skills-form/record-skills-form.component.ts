import { Component, OnInit, ɵConsole, EventEmitter } from '@angular/core';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { Skill } from '../../../shared/entites/Skill';
import { SkillsService } from '../../../shared/services/skills.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-record-skills-form',
  templateUrl: './record-skills-form.component.html',
  styleUrls: ['./record-skills-form.component.scss']
})
export class RecordSkillsFormComponent implements OnInit {
  item:string;
  curskil: Skill;
  skillSaved = new EventEmitter<boolean>();
  loading = false;
  set currentSkill(sk: Skill) {
    this.curskil = sk;
    this.item = this.curskil.skillLevel;
  }

  get currentSkill(): Skill {
    return this.curskil;
  }
  owner;
  skillpropositions = [];
  constructor(private userSvc: UtilisateurService, private skillSvc: SkillsService,
              private tostSvc: ToastrService) {

  }


  ngOnInit() {
    if (!this.currentSkill) {
      this.currentSkill = new Skill();
    }
    firebase.auth().onAuthStateChanged(v => {
      this.owner = v.uid;
    });
    this.skillSvc.getAllUserSkills().onSnapshot(vla => {

      vla.forEach(sk => {
        const lab = (sk.data() as Skill).skillName.toUpperCase();
       // console.log(lab);
       // console.log(this.skillpropositions);
        if (!this.skillpropositions.includes(lab)) {
          this.skillpropositions.push(lab);
        }
      });
    });
  }
  name:any;

  save() {
    this.currentSkill.skillName = this.currentSkill.skillName.toUpperCase();
    this.loading = true;
    this.currentSkill.archived = false;
    this.currentSkill.skillLevel = this.item;
    console.log(this.currentSkill);
    // this.currentSkill.skillLevel = this.name;
    if (this.owner) {
      if (this.currentSkill.id) {
        this.skillSvc.updateuserSkill(this.owner, this.currentSkill).then(d => {
          this.tostSvc.success('Skill successfully updated');
          this.loading = false;
          this.skillSaved.emit(true);
        }).catch(err => {
          this.tostSvc.error('Error Occured : ' + err.message);
          this.loading = false;
        });
      } else {
        this.skillSvc.adduserSkill(this.owner, this.currentSkill).then(d => {
          this.tostSvc.success('Skill successfully saved');
          this.loading = false;
          this.skillSaved.emit(true);
        }).catch(err => {
          this.tostSvc.error('Error Occured : ' + err.message);
          this.loading = false;
        });
      }
    }
  }
}
