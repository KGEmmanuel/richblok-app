import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { Realisation } from 'src/app/shared/entites/Realisation';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-record-realisation',
  templateUrl: './record-realisation.component.html',
  styleUrls: ['./record-realisation.component.scss']
})
export class RecordRealisationComponent implements OnInit {

  form = false;
  uid;
  currentRealisation;
  realisation = new Array<Realisation>();

  private auth = inject(Auth);

  constructor(private realSvc: PortfolioService) {

  }
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
  showForm() {
    this.form = true;
  }
  hideForm() {
    this.form = false;
  }
  edit(event) {
    this.currentRealisation = event;
    this.form = true;
  }
}
