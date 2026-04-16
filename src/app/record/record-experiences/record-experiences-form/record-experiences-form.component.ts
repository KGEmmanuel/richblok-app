import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Experience } from 'src/app/shared/entites/Experience';
import { FormationService } from 'src/app/shared/services/formation.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-record-experiences-form',
  templateUrl: './record-experiences-form.component.html',
  styleUrls: ['./record-experiences-form.component.scss']
})
export class RecordExperiencesFormComponent implements OnInit {
  @Input()
  currentExperience: Experience;
  @Output()
  itemSaved = new EventEmitter<boolean>();

  currentOnIt = false;
  uid;
  expForm: UntypedFormGroup;
submitted = false;
  constructor(private expeSvc: ExperienceService, private afAuth: AngularFireAuth,
    private toastr: ToastrService, private laodsvc: NgxUiLoaderService, private formBuilder: UntypedFormBuilder) {
    this.afAuth.authState.subscribe(val => {
      if (val) {
        this.uid = val.uid;
      }
    })
  }

  ngOnInit() {
    if (!this.currentExperience) {
      this.currentExperience = new Experience();
    }

    this.expForm = this.formBuilder.group({
      libelle: ['', Validators.required],
      entreprise: ['', Validators.required],
      typeExperience: ['', Validators.required],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
    description: ['', Validators.required],
}, );
  }
  get f() { return this.expForm.controls; }

  checkChanged(event) {
    this.currentOnIt = !this.currentOnIt;
    this.currentExperience.fin = null;
  }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.expForm.invalid) {
        return;
    }

    this.laodsvc.start();
    if (!this.currentExperience.id) {
        this.expeSvc.save(this.uid, this.currentExperience).then(v => {
          this.itemSaved.emit(true);
          this.currentExperience = new Experience();
          this.laodsvc.stop();
          this.toastr.success('Experience successfuly saved', 'Success');

        }).catch(err => {
          this.laodsvc.stop();
          this.toastr.error('An Error occured while saving your experience: ' + err.message, 'Ooops');
        })
      } else {
        this.expeSvc.update(this.uid, this.currentExperience).then(v => {
          this.laodsvc.start();
          this.toastr.success('Experience successfuly saved', 'Success');
          this.itemSaved.emit(true);
          this.currentExperience = new Experience();
        }).catch(err => {
          this.laodsvc.stop();
          this.toastr.error('An Error occured while saving your experience: ' + err.message, 'Ooops');
        })
      }
    }


}
