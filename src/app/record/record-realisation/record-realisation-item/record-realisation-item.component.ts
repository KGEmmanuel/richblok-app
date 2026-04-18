import { Component, OnInit, Input, EventEmitter, Output, inject } from '@angular/core';
import { Experience } from 'src/app/shared/entites/Experience';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { ToastrService } from 'ngx-toastr';
import { OrganisationAboutComponent } from 'src/app/organisation/organisation-about/organisation-about.component';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { OrganisationService } from 'src/app/shared/services/organisation.service';
import { Realisation } from 'src/app/shared/entites/Realisation';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';
import { Auth, authState } from '@angular/fire/auth';


@Component({
  selector: 'app-record-realisation-item',
  templateUrl: './record-realisation-item.component.html',
  styleUrls: ['./record-realisation-item.component.scss']
})
export class RecordRealisationItemComponent implements OnInit {
  realisation = new Array<Realisation>();
  @Input()
  currentRealisation: Realisation;
  @Input()
  uid;
  @Input()
  displaymode = 'priv';

  @Output()
  selectForEdit = new EventEmitter<Realisation>();

  
  private auth = inject(Auth);

  constructor(private realSvc: PortfolioService,private expSvc: ExperienceService,
              private toastSvc: ToastrService, private entSvc: OrganisationService) { }

  ngOnInit() {

    authState(this.auth).subscribe(v => {
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
  delete(){
    const b = confirm('Do you realy want to delete this item?')
    if(b){
    this.realSvc.delete(this.uid,this.currentRealisation.id)
    }
  }

  edit() {
    this.selectForEdit.emit(this.currentRealisation);
  }
detail(){
  this.selectForEdit.emit(this.currentRealisation);
}
}
