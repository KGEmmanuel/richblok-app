import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Entreprise } from '../../shared/entites/Entreprise';
import { OrganisationService } from '../../shared/services/organisation.service';
<<<<<<< HEAD
=======
import { Title, Meta } from '@angular/platform-browser';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
@Component({
  selector: 'app-organisation-profile',
  templateUrl: './organisation-profile.component.html',
  styleUrls: ['./organisation-profile.component.scss']
})
export class OrganisationProfileComponent implements OnInit {

  currentorg: Entreprise;
  nbrAbonnees = 0;
<<<<<<< HEAD
  constructor(private route: ActivatedRoute, private orgSvc: OrganisationService, private router: Router) {
=======
  constructor(private route: ActivatedRoute, private orgSvc: OrganisationService, private router: Router, private title: Title, private meta: Meta) {
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
<<<<<<< HEAD
=======
    this.title.setTitle('RichBlok | Organisation');
    this.meta.updateTag({ name: 'description', content: 'Have an organisation account on Richblok permitting you to create a job offer and hire talents with background checks' });
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
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
