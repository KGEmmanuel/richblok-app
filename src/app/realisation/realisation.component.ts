import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Experience } from 'src/app/shared/entites/Experience';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { ToastrService } from 'ngx-toastr';
import { OrganisationAboutComponent } from 'src/app/organisation/organisation-about/organisation-about.component';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { OrganisationService } from 'src/app/shared/services/organisation.service';
import { Realisation } from 'src/app/shared/entites/Realisation';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-realisation',
  templateUrl: './realisation.component.html',
  styleUrls: ['./realisation.component.scss']
})
export class RealisationComponent implements OnInit {
  realisation = new Array<Realisation>();
  curentRealisation;
  uid;

  @Input()
  displaymode = 'pub';

  constructor(private realSvc: PortfolioService, private expSvc: ExperienceService,
    private toastSvc: ToastrService, private entSvc: OrganisationService,
    private afStorage: AngularFireStorage, private afAuth: AngularFireAuth) { }
  ngOnInit() {

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

}
