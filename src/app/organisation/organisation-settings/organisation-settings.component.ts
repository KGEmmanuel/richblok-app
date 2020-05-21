import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Entreprise } from '../../shared/entites/Entreprise';
import { OrganisationService } from '../../shared/services/organisation.service';

@Component({
  selector: 'app-organisation-settings',
  templateUrl: './organisation-settings.component.html',
  styleUrls: ['./organisation-settings.component.scss']
})
export class OrganisationSettingsComponent implements OnInit {
  phone = false;
  currentorg: Entreprise;
  nbrAbonnees = 0;
  constructor(private route: ActivatedRoute, private orgSvc: OrganisationService, private router: Router) {

    this.router.onSameUrlNavigation = 'reload';
  }

  dispPhone(){
    this.phone = true;
  }
  ngOnInit() {
    // let id = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe(routeParams => {
      const id = routeParams.id;
      this.orgSvc.getDocRef(id).onSnapshot(val => {
        this.currentorg = val.data() as Entreprise;
        this.currentorg.id = val.id;
        if (this.currentorg.abonnees) {
          this.nbrAbonnees = this.currentorg.abonnees.length;
        }
      });
    });

  }

}
