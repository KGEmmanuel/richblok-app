import { Component, OnInit, Input } from '@angular/core';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Skill } from '../shared/entites/Skill';
import { SkillsService } from '../shared/services/skills.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  form = false;
  @Input()
  // associatedUser: string;
  userSkills = new Array<Skill>();
  uid;
  constructor(private skilSvc: SkillsService, private afAuth: AngularFireAuth) {

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(v => {
      this.uid = v.uid;
      this.skilSvc.getSkillsof(this.uid).onSnapshot(all => {
        this.userSkills = new Array<Skill>();
        all.forEach(val => {
          const sk = val.data() as Skill;
          sk.id = val.id;
          this.userSkills.push(sk);
        });
      });
    })


  }
  showForm() {
    this.form = true;
  }
  hideForm() {
    this.form = false;
  }
}
