import { Component, OnInit } from '@angular/core';
import { Langue } from 'src/app/shared/entites/Langue';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-record-languages',
  templateUrl: './record-languages.component.html',
  styleUrls: ['./record-languages.component.scss']
})
export class RecordLanguagesComponent implements OnInit {

  form = false;
  currentLang = new Langue();
  allLanguages: Array<Langue>;
  uid;
  constructor(private lngSvc: LanguageService, private afAuth: AngularFireAuth, private toastrSvc: ToastrService) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(v=>{
      if(v){
        this.uid = v.uid;
        this.lngSvc.listLanguages(this.uid).onSnapshot(v=>{
          this.allLanguages = [];  
          v.forEach(element => {
              const a = element.data() as Langue;
              a.id = element.id;
              this.allLanguages.push(a);
            });
        })
      }
    })
  }
  showForm() {
    this.form = true;
  }
  hideForm() {
    this.form = false;
  }

  edit(event){
    this.currentLang = event;
    this.showForm();
  }

}
