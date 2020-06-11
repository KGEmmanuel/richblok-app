import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-jobs-post',
  templateUrl: './jobs-post.component.html',
  styleUrls: ['./jobs-post.component.scss']
})
export class JobsPostComponent implements OnInit {
<<<<<<< HEAD
  constructor() { }

  ngOnInit() {
=======
  currentJob: OffresEmploi = new OffresEmploi();
  jobId: string;

  constructor(private jobSvc: OffreEmploiService, private route: ActivatedRoute, private router: Router, private toastrSvc: ToastrService, private loadingSvc: NgxUiLoaderService) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    let accessMode = this.route.snapshot.paramMap.get('mode');
    if(id){
       this.jobSvc.getDocRef(id).onSnapshot(sn=>{
          if(sn){
            this.currentJob = sn.data() as OffresEmploi;
            this.currentJob.id = id;
            this.jobId = id;
          }
          else{
             this.toastrSvc.error('Unable to find selected Job offer');
            let b =  confirm('Do you want to create new one ?')
             if(b){
                this.currentJob = new OffresEmploi();
             }
          }
       })
    }
  }

  navStep1(){
    if(this.jobId){
      this.router.navigate(['post-job-step-one',{id:this.jobId}]);
    }
    else{
      this.router.navigate(['post-job-step-one']);
    }
  }
  nextStep(){
    this.loadingSvc.start()
    const step = this.currentJob.currentStep;
    this.jobSvc.closeStep(this.currentJob).then(v=>{
      this.toastrSvc.success('Step # '+step+' Succeffuly closed, You can now Proceed the next step');
    }).catch(err=>{
      this.toastrSvc.error('An Error occured '+err.message);
    }).finally(()=>{
      this.loadingSvc.stop();
    })
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }
}
