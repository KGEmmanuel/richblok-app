import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { OrganisationService } from 'src/app/shared/services/organisation.service';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';

@Component({
  selector: 'app-jobs-item',
  templateUrl: './jobs-item.component.html',
  styleUrls: ['./jobs-item.component.scss']
})
export class JobsItemComponent implements OnInit {
  @Input()
  currentJob: OffresEmploi;

  org: Entreprise;
  user: Utilisateur;
  currentUser: Utilisateur;
  connections = new Array<Utilisateur>();
  dateDiff = 0;
  constructor(private afAuth: AngularFireAuth, private offreSvc: OffreEmploiService, private orgSvc: OrganisationService, private userSvc: UtilisateurService
   , private jobAppSvc: JobApplicationService) { }

  ngOnInit(): void {
    if (this.currentJob.ownerOrg) {
      this.orgSvc.getDocRef(this.currentJob.ownerOrg).onSnapshot(or => {
        this.org = or.data() as Entreprise;
        this.org.id = or.id;
      })
    }
    else {
      if (this.currentJob.ownerUser) {
        this.userSvc.getDocRef(this.currentJob.ownerUser).onSnapshot(us => {
          this.user = us.data() as Utilisateur;
          this.user.id = us.id;
        })
      }
    }

    this.afAuth.onAuthStateChanged(val => {
      if (val) {
        this.userSvc.getDocRef(val.uid).onSnapshot(us => {
          this.currentUser = us.data() as Utilisateur;
          this.currentUser.id = us.id;
          if (this.currentJob.postulants) {
            this.currentJob.postulants.filter(value => this.currentUser.abonnees?.includes(value)).forEach(con => {
              this.userSvc.getDocRef(con).onSnapshot(contact => {
                const connection = contact.data() as Utilisateur;
                connection.id = contact.id;
                this.connections.push(connection);
              })
            });
          }
        })
      }

    })
    console.log('date', this.currentJob.dateCreation.valueOf(), new Date().valueOf())
    this.dateDiff = this.currentJob.dateCreation.valueOf() - new Date().valueOf();


  }

}
