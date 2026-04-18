import { Component, OnInit, Input , inject } from '@angular/core';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Skill } from '../shared/entites/Skill';
import { SkillsService } from '../shared/services/skills.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);

  form = false;
  @Input()
  // associatedUser: string;
  userSkills = new Array<Skill>();
  uid;
  constructor(private skilSvc: SkillsService) {

  }

  ngOnInit() {
    authState(this.auth).subscribe(v => {
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
