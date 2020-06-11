<<<<<<< HEAD
=======
import { NgxUiLoaderService } from 'ngx-ui-loader';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Langue } from 'src/app/shared/entites/Langue';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
<<<<<<< HEAD
=======
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

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
<<<<<<< HEAD
  constructor(private langSvc: LanguageService, private toastrSvc: ToastrService, private agAuth: AngularFireAuth) { }
=======
  lanForm: FormGroup;
submitted = false;
  constructor(private langSvc: LanguageService, private toastrSvc: ToastrService,
              private agAuth: AngularFireAuth, private formBuilder: FormBuilder,
              private loadSvc: NgxUiLoaderService) { }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

  ngOnInit() {
    this.agAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
      }
    })
<<<<<<< HEAD
  }


  save() {
    console.log(this.currentLang);
=======
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    if (this.currentLang.id) {
      this.langSvc.updateLanguage(this.uid, this.currentLang.id, this.currentLang).then(() => {
        this.toastrSvc.success('Language successfuly updated');
        this.currentLang = new Langue();
        this.langSaved.emit(true);
<<<<<<< HEAD
      }).catch(err => {
        this.toastrSvc.error('Error while updating language : ' + err.message);
=======
        this.loadSvc.stop();
      }).catch(err => {
        this.toastrSvc.error('Error while updating language : ' + err.message);
        this.loadSvc.stop();
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
      })
    } else {
      this.langSvc.addLanguage(this.uid, this.currentLang).then(() => {
        this.toastrSvc.success('Language successfuly added');
        this.currentLang = new Langue();
        this.langSaved.emit(true);
<<<<<<< HEAD
      }).catch(err => {
        this.toastrSvc.error('Error while adding language : ' + err.message);
=======
        this.loadSvc.stop();
      }).catch(err => {
        this.toastrSvc.error('Error while adding language : ' + err.message);
        this.loadSvc.stop();
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
      })
    }
  }
}
