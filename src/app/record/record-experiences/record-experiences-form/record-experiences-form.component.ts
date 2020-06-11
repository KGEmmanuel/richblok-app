import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Experience } from 'src/app/shared/entites/Experience';
import { FormationService } from 'src/app/shared/services/formation.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  constructor(private expeSvc: ExperienceService, private afAuth: AngularFireAuth,
    private toastr: ToastrService, private laodsvc: NgxUiLoaderService) {
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

  }

  checkChanged(event) {
    this.currentOnIt = !this.currentOnIt;
    this.currentExperience.fin = null;
  }

  save() {
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
