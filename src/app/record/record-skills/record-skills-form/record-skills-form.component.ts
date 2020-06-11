<<<<<<< HEAD
import { Component, OnInit, ɵConsole, EventEmitter, Output } from '@angular/core';
=======
import { Component, OnInit, ɵConsole, EventEmitter, Output, Input } from '@angular/core';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { Skill } from '../../../shared/entites/Skill';
import { SkillsService } from '../../../shared/services/skills.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
<<<<<<< HEAD
=======
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
@Component({
  selector: 'app-record-skills-form',
  templateUrl: './record-skills-form.component.html',
  styleUrls: ['./record-skills-form.component.scss']
})
export class RecordSkillsFormComponent implements OnInit {
  item:string;
<<<<<<< HEAD
=======

>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  curskil: Skill;
  @Output()
  skillSaved = new EventEmitter<boolean>();

  loading = false;
<<<<<<< HEAD
  set currentSkill(sk: Skill) {
=======

  skillForm: FormGroup;
submitted = false;
  @Input()
  set currentSkill(sk: Skill) {
    if(!sk){
      return;
    }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    this.curskil = sk;
    this.item = this.curskil.skillLevel;
  }

  get currentSkill(): Skill {
    return this.curskil;
  }
  owner;
  skillpropositions = [];
  constructor(private userSvc: UtilisateurService, private skillSvc: SkillsService,
<<<<<<< HEAD
              private tostSvc: ToastrService, private loadsvc: NgxUiLoaderService) {
=======
              private tostSvc: ToastrService, private loadsvc: NgxUiLoaderService, private formBuilder: FormBuilder) {
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

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
<<<<<<< HEAD
  }
  name:any;

  save() {
=======
    this.skillForm = this.formBuilder.group({
      skillName: ['', Validators.required],
      skillLevel: ['', Validators.required],
      skillduration: ['', Validators.required],

}, );
  }
  name:any;
  get f() { return this.skillForm.controls; }
  save(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.skillForm.invalid) {
        return;
    }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    this.loadsvc.start();
    this.currentSkill.skillName = this.currentSkill.skillName.toUpperCase();
    this.loading = true;
    this.currentSkill.archived = false;
<<<<<<< HEAD
    this.currentSkill.skillLevel = this.item;
=======
    //this.currentSkill.skillLevel = this.item;
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    console.log(this.currentSkill);
    // this.currentSkill.skillLevel = this.name;
    if (this.owner) {
      if (this.currentSkill.id) {
        this.skillSvc.updateuserSkill(this.owner, this.currentSkill).then(d => {
          this.loadsvc.stop();
          this.tostSvc.success('Skill successfully updated');
          this.loading = false;
          this.skillSaved.emit(true);
        }).catch(err => {
          this.loadsvc.stop();
          this.tostSvc.error('Error Occured : ' + err.message);
          this.loading = false;
        });
      } else {
        this.skillSvc.adduserSkill(this.owner, this.currentSkill).then(d => {
          this.loadsvc.stop();
          this.tostSvc.success('Skill successfully saved');
          this.loading = false;
          this.skillSaved.emit(true);
        }).catch(err => {
          this.loadsvc.stop();
          this.tostSvc.error('Error Occured : ' + err.message);
          this.loading = false;
        });
      }
    }
  }
}
