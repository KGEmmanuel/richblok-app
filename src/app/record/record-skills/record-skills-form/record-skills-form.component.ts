import { Component, OnInit, ɵConsole, EventEmitter, Output, Input } from '@angular/core';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { Skill } from '../../../shared/entites/Skill';
import { SkillsService } from '../../../shared/services/skills.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-record-skills-form',
  templateUrl: './record-skills-form.component.html',
  styleUrls: ['./record-skills-form.component.scss']
})
export class RecordSkillsFormComponent implements OnInit {
  item:string;

  curskil: Skill;
  @Output()
  skillSaved = new EventEmitter<boolean>();

  loading = false;

  skillForm: UntypedFormGroup;
submitted = false;
  @Input()
  set currentSkill(sk: Skill) {
    if(!sk){
      return;
    }
    this.curskil = sk;
    this.item = this.curskil.skillLevel;
  }

  get currentSkill(): Skill {
    return this.curskil;
  }
  owner;
  skillpropositions = [];
  constructor(private userSvc: UtilisateurService, private skillSvc: SkillsService,
              private tostSvc: ToastrService, private loadsvc: NgxUiLoaderService, private formBuilder: UntypedFormBuilder) {

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
    this.loadsvc.start();
    this.currentSkill.skillName = this.currentSkill.skillName.toUpperCase();
    this.loading = true;
    this.currentSkill.archived = false;
    //this.currentSkill.skillLevel = this.item;
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
