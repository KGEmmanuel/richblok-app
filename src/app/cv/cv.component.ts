import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { Formation } from '../shared/entites/Formation';
import { Langue } from '../shared/entites/Langue';
import { Experience } from '../shared/entites/Experience';
import { Skill } from '../shared/entites/Skill';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Router } from '@angular/router';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { SkillsService } from '../shared/services/skills.service';
import { LanguageService } from '../shared/services/language.service';
import { ExperienceService } from '../shared/services/experience.service';
import { FormationService } from '../shared/services/formation.service';
import { Realisation } from 'src/app/shared/entites/Realisation';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as jsPDF from 'jspdf';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss', '../../assets/cv/css/materialize.min.css',
'../../assets/cv/css/animate.css','../../assets/cv/icons/font-awesome-4.1.0/css/font-awesome.min.css',
'../../assets/cv/css/style.css','../../assets/cv/css/responsive.css']
})
export class CvComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  currentUser= new Utilisateur();;
  accformationList: Array<Formation>;
  proformationList: Array<Formation>;
  private USER_ROUTE_URL = '/';
  skills: Array<Skill>;
  items: Array<Experience>;
  currentLang: Langue;
  showoutlet = false;
  currentExperience: Experience;
  uid;
  typeFormation = 'ACC';
  LangLevels;
  userid: string;
  realisation = new Array<Realisation>();

  langues = new Array<Langue>();
  set nav(nav: string) {
    if (nav === this.USER_ROUTE_URL) {
      this.showoutlet = false;
    } else {
      this.showoutlet = true;
    }
    this._nav = nav;
  }

  private _nav: string;

  constructor(private router: Router, private userSvc: UtilisateurService,
    private skSvc: SkillsService, private lngsvc: LanguageService, private frmtionSvc: FormationService,
     private expSvc: ExperienceService,private langSvc: LanguageService,
     private afAuth: AngularFireAuth, private realSvc: PortfolioService,
     private loadSvc: NgxUiLoaderService, private toast: ToastrService, private title: Title, private meta: Meta) {
      this.LangLevels = lngsvc.LanguagesLevels;
  }




  ngOnInit() {
    this.title.setTitle('RichBlok | CV');
    this.meta.updateTag({ name: 'description', content: 'Generate your CV and send them to recruiters' });
    firebase.auth().onAuthStateChanged(val => {
      if (val) {
        this.uid = val.uid;
        this.userSvc.getDocRef(this.uid).onSnapshot(data => {
          if (data.data()) {
            this.currentUser = data.data() as Utilisateur;
            this.currentUser.id = data.id;
            this.skSvc.getSkillsof(val.uid).onSnapshot(all => {
              this.skills = [];
              all.forEach(sk => {
                this.skills.push(sk.data() as Skill);
              });
            });
          }
        });
        this.expSvc.listExperiences(this.uid).onSnapshot(al => {
          this.items = [];
          al.forEach( v => {
            const ex = v.data() as Experience;
            ex.id = v.id;
            this.items.push(ex);
          });
        });
        this.langSvc.listLanguages(this.uid).onSnapshot(all => {
          this.langues = [];
          all.forEach(v => {
            const l = v.data() as Langue;
            l.id = v.id;
            this.langues.push(l);
          });
        });
        this.frmtionSvc.editableFormationsListQuery(this.uid, 'ACC').onSnapshot(val => {
          this.accformationList = new Array<Formation>();
          val.forEach(d => {
            const f = d.data() as Formation;
            f.id = d.id;
            this.accformationList.push(f);
          });
        });
        this.frmtionSvc.editableFormationsListQuery(this.uid, 'PRO').onSnapshot(val => {
          this.proformationList = new Array<Formation>();
          val.forEach(d => {
            const f = d.data() as Formation;
            f.id = d.id;
            this.proformationList.push(f);
          });
        });
      }
    });
    this.afAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
        this.realSvc.getportfolios(this.uid).onSnapshot(val => {
          this.realisation = [];
          val.forEach(element => {
            const ex = element.data() as Realisation;
            ex.id = element.id;
            this.realisation.push(ex);
          });
        });
      }
    })
  }




public downloadPDF():void {
  let DATA = this.pdfTable.nativeElement;
  let doc = new jsPDF('p','pt', 'a4');

  let handleElement = {
    '#editor':function(element,renderer){
      return true;
    }
  };
  doc.fromHTML(DATA.innerHTML,15,15,{
    'width': 200,
    'elementHandlers': handleElement
  },
  function (dispose) {
    doc.save('CV.pdf');
    });
}
public openPDF():void {
  let DATA = this.pdfTable.nativeElement;
  let doc = new jsPDF('p','pt', 'a4');
  doc.fromHTML(DATA.innerHTML,15,15);
  doc.output('dataurlnewwindow');
}
}
