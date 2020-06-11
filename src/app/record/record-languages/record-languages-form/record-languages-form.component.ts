import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Langue } from 'src/app/shared/entites/Langue';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';

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
  constructor(private langSvc: LanguageService, private toastrSvc: ToastrService, private agAuth: AngularFireAuth) { }

  ngOnInit() {
    this.agAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
      }
    })
  }


  save() {
    console.log(this.currentLang);
    if (this.currentLang.id) {
      this.langSvc.updateLanguage(this.uid, this.currentLang.id, this.currentLang).then(() => {
        this.toastrSvc.success('Language successfuly updated');
        this.currentLang = new Langue();
        this.langSaved.emit(true);
      }).catch(err => {
        this.toastrSvc.error('Error while updating language : ' + err.message);
      })
    } else {
      this.langSvc.addLanguage(this.uid, this.currentLang).then(() => {
        this.toastrSvc.success('Language successfuly added');
        this.currentLang = new Langue();
        this.langSaved.emit(true);
      }).catch(err => {
        this.toastrSvc.error('Error while adding language : ' + err.message);
      })
    }
  }
}
