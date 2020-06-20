import { Document } from './../../shared/entites/Document';
import { Component, OnInit } from '@angular/core';
import { Experience } from 'src/app/shared/entites/Experience';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormationService } from 'src/app/shared/services/formation.service';
import { Formation } from 'src/app/shared/entites/Formation';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-record-document-form',
  templateUrl: './record-document-form.component.html',
  styleUrls: ['./record-document-form.component.scss']
})
export class RecordDocumentFormComponent implements OnInit {
  currentDoc = new Document();
  currentExperience;
  uid;
  docForm : FormGroup
  submitted = false;
  experiences = new Array<Experience>();
  currentTraining = new Formation();
  allTrainings = new Array<Formation>();

  constructor(private expSvc: ExperienceService, private afAuth: AngularFireAuth, private formService: FormationService
              ,private toastr: ToastrService, private loadsvc: NgxUiLoaderService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
        this.expSvc.listExperiences(this.uid).onSnapshot(val => {
          this.experiences = [];
          val.forEach(element => {
            const ex = element.data() as Experience;
            ex.id = element.id;
            this.experiences.push(ex);
          });
        });
      }
    })
    this.afAuth.authState.subscribe(val => {
      if (val) {
        this.uid = val.uid;
        this.formService.editableFormationsListQuery(this.uid).onSnapshot(val => {
          this.allTrainings = [];
          val.forEach(element => {
              const train = element.data() as Formation;
              train.id = element.id;
              this.allTrainings.push(train);
              console.log('train', train);
          });
        });
      }
    });
    this.docForm = this.formBuilder.group({
      documentName: ['', Validators.required],
      documenttype: ['', Validators.required],
      documentRelatedElmt: ['', Validators.required],
      documentDescription: ['', Validators.required],
      signLevel: ['', Validators.required],
      visib: ['', Validators.required],
}, );
  }
  get f() { return this.docForm.controls; }
  save(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.docForm.invalid) {
        return;
    }
  }
}
