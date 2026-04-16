import { Component, OnInit } from '@angular/core';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { JobApplication } from 'src/app/shared/entites/JobApplication';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-jobs-applied',
  templateUrl: './jobs-applied.component.html',
  styleUrls: ['./jobs-applied.component.scss']
})
export class JobsAppliedComponent implements OnInit {

  jobapplications: Array<JobApplication>;
  uid;
  constructor(private afAuthSvc: AngularFireAuth, private jobSvc: OffreEmploiService, private jobapplicationSvc: JobApplicationService, private userSvc: UtilisateurService) { }

  ngOnInit(): void {

    this.afAuthSvc.onAuthStateChanged(u => {
      if (u) {
        this.uid = u.uid;
        this.jobapplicationSvc.findBy('userRef',this.uid,'dateCreation').ref.onSnapshot(v=>{
          this.jobapplications = [];
            v.forEach(jap=>{
              const app = jap.data() as JobApplication;
              app.id = jap.id;
              this.jobapplications.push(app);
            })
        })
      }
    })

  }

}
