import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Langue } from 'src/app/shared/entites/Langue';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-record-languages-form',
  templateUrl: './record-languages-form.component.html',
  styleUrls: ['./record-languages-form.component.scss']
})
export class RecordLanguagesFormComponent implements OnInit {
  @Input()
  currentLang: Langue;
  uid;
  langSaved = new EventEmitter<boolean>();
  lanForm: FormGroup;
submitted = false;
  constructor(private langSvc: LanguageService, private toastrSvc: ToastrService,
              private agAuth: AngularFireAuth, private formBuilder: FormBuilder,
              private loadSvc: NgxUiLoaderService) { }

  ngOnInit() {
    this.agAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
      }
    })
    this.lanForm = this.formBuilder.group({
      libele: ['', Validators.required],
      niveauParle: ['', Validators.required],
      niveauLu: ['', Validators.required],
      niveauEcrit: ['', Validators.required],
}, );
  }
  get f() { return this.lanForm.controls; }

  save() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.lanForm.invalid) {
        return;
    }
    this.loadSvc.start();
    if (this.currentLang.id) {
      this.langSvc.updateLanguage(this.uid, this.currentLang.id, this.currentLang).then(() => {
        this.toastrSvc.success('Language successfuly updated');
        this.currentLang = new Langue();
        this.langSaved.emit(true);
        this.loadSvc.stop();
      }).catch(err => {
        this.toastrSvc.error('Error while updating language : ' + err.message);
        this.loadSvc.stop();
      })
    } else {
      this.langSvc.addLanguage(this.uid, this.currentLang).then(() => {
        this.toastrSvc.success('Language successfuly added');
        this.currentLang = new Langue();
        this.langSaved.emit(true);
        this.loadSvc.stop();
      }).catch(err => {
        this.toastrSvc.error('Error while adding language : ' + err.message);
        this.loadSvc.stop();
      })
    }
  }
}
