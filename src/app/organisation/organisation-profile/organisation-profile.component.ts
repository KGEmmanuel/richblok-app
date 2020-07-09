import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Entreprise } from '../../shared/entites/Entreprise';
import { OrganisationService } from '../../shared/services/organisation.service';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-organisation-profile',
  templateUrl: './organisation-profile.component.html',
  styleUrls: ['./organisation-profile.component.scss']
})
export class OrganisationProfileComponent implements OnInit {

  currentorg: Entreprise;
  nbrAbonnees = 0;
  constructor(private route: ActivatedRoute, private orgSvc: OrganisationService, private router: Router, private title: Title, private meta: Meta) {

    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    this.title.setTitle('RichBlok | Organisation');
    this.meta.updateTag({ name: 'description', content: 'Have an organisation account on Richblok permitting you to create a job offer and hire talents with background checks' });
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
