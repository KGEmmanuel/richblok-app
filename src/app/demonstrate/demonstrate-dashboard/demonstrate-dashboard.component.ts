import { Component, OnInit , inject } from '@angular/core';
import { DemonstrateService } from 'src/app/shared/services/demonstrate.service';
import { Auth, authState } from '@angular/fire/auth';
import { Demonstration } from 'src/app/shared/entites/demonstration';

@Component({
  selector: 'app-demonstrate-dashboard',
  templateUrl: './demonstrate-dashboard.component.html',
  styleUrls: ['./demonstrate-dashboard.component.scss']
})
export class DemonstrateDashboardComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);
  nbreVideos = 0;
  nbredocuments = 0;
  nbreVideoVue = 0;
  nbreDocumentsVue= 0;
  nbreImg = 0;
  nbreImgVue = 0;
  uid;
  constructor(private demoSvc: DemonstrateService, private authSvc: Auth) { }

  ngOnInit() {

    this.authSvc.onAuthStateChanged(v=>{
      if(v){
        this.uid = v.uid;
        this.demoSvc.get(this.uid).onSnapshot(st=>{
          st.forEach(element => {
            const dem = element.data() as Demonstration;
            if(dem.medias) {
            dem.medias.forEach(med => {
              if(med.mediatype==='IMG'){ 
                this.nbreImg ++;
              }
              if(med.mediatype==='VID'){ 
                this.nbreVideos ++;
              }
              if(med.mediatype==='DOC' || med.mediatype==='HTML' ){ 
                this.nbredocuments ++;
              }
            });}
          });
        })
      }
    })
  }

}
