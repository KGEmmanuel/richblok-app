import { Document } from './../../shared/entites/Document';
import { Component, OnInit , inject } from '@angular/core';
import { Experience } from 'src/app/shared/entites/Experience';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { Auth, authState } from '@angular/fire/auth';
import { FormationService } from 'src/app/shared/services/formation.service';
import { Formation } from 'src/app/shared/entites/Formation';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-record-document-form',
  templateUrl: './record-document-form.component.html',
  styleUrls: ['./record-document-form.component.scss']
})
export class RecordDocumentFormComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);
  currentDoc = new Document();
  currentExperience;
  uid;
  docForm: UntypedFormGroup;
  submitted = false;
  experiences = new Array<Experience>();
  currentTraining = new Formation();
  allTrainings = new Array<Formation>();
  currentfile: File;
  constructor(private expSvc: ExperienceService, private formService: FormationService
    ,         private toastr: ToastrService, private loadsvc: NgxUiLoaderService, private formBuilder: UntypedFormBuilder,
              private fileUpSvc: FileUploadService) { }

  ngOnInit(): void {
    authState(this.auth).subscribe(v => {
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
    });
    authState(this.auth).subscribe(val => {
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
    });
  }
  get f() { return this.docForm.controls; }
  onSelectFile(event) {
    this.currentfile = event.target.files && event.target.files[0];
  }

  save() {
    this.submitted = true;
    if (!this.currentfile) {
      this.toastr.error('Aucun fichier choisi');
      return;
    }
    
    // stop here if form is invalid
    if (this.docForm.invalid) {
      return;
    }
  }
}
