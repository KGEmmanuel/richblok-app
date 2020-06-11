import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Entreprise } from '../../shared/entites/Entreprise';
import { OrganisationService } from '../../shared/services/organisation.service';
@Component({
  selector: 'app-organisation-profile',
  templateUrl: './organisation-profile.component.html',
  styleUrls: ['./organisation-profile.component.scss']
})
export class OrganisationProfileComponent implements OnInit {

  currentorg: Entreprise;
  nbrAbonnees = 0;
  constructor(private route: ActivatedRoute, private orgSvc: OrganisationService, private router: Router) {

    this.router.onSameUrlNavigation = 'reload';
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
settings(){
  this.router.navigate(['organisation-settings']);
}
}
