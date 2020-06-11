import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import { DemonstrateService } from 'src/app/shared/services/demonstrate.service';
import { FirebaseAuth } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { Demonstration } from 'src/app/shared/entites/demonstration';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-demonstrate-dashboard',
  templateUrl: './demonstrate-dashboard.component.html',
  styleUrls: ['./demonstrate-dashboard.component.scss']
})
export class DemonstrateDashboardComponent implements OnInit {
<<<<<<< HEAD

  constructor() { }

  ngOnInit() {
=======
  nbreVideos = 0;
  nbredocuments = 0;
  nbreVideoVue = 0;
  nbreDocumentsVue= 0;
  nbreImg = 0;
  nbreImgVue = 0;
  uid;
  constructor(private demoSvc: DemonstrateService, private authSvc: AngularFireAuth) { }

  ngOnInit() {

    this.authSvc.auth.onAuthStateChanged(v=>{
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

}
