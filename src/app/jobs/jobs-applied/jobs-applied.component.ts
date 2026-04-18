import { Component, OnInit, inject } from '@angular/core';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { JobApplication } from 'src/app/shared/entites/JobApplication';
import { Auth } from '@angular/fire/auth';
import { onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-jobs-applied',
  templateUrl: './jobs-applied.component.html',
  styleUrls: ['./jobs-applied.component.scss']
})
export class JobsAppliedComponent implements OnInit {
  // D7 Day 3 — modular Auth + BaseService.
  private auth = inject(Auth);

  jobapplications: Array<JobApplication>;
  uid;
  constructor(private afAuthSvc: Auth, private jobSvc: OffreEmploiService, private jobapplicationSvc: JobApplicationService, private userSvc: UtilisateurService) { }

  ngOnInit(): void {

    this.afAuthSvc.onAuthStateChanged(u => {
      if (u) {
        this.uid = u.uid;
        const q = this.jobapplicationSvc.findBy('userRef', this.uid, 'dateCreation');
        onSnapshot(q, v => {
          this.jobapplications = [];
          v.forEach(jap => {
            const app = jap.data() as JobApplication;
            app.id = jap.id;
            this.jobapplications.push(app);
          });
        });
      }
    })

  }

}
