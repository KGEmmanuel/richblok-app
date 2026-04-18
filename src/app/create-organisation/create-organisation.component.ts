import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { Entreprise } from '../shared/entites/Entreprise';
import { OrganisationService } from '../shared/services/organisation.service';
import { Auth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit {
  _nmEts: string;
  _url: string;
  Form = false;
  step:number;
  currentEts = new Entreprise();


  dispForm() {
    this.Form = true;

  }
  private auth = inject(Auth);

  constructor(private organisationSvc: OrganisationService,private toastr: ToastrService, private router: Router,
              private route: ActivatedRoute, private title:Title, private meta: Meta) {
  }

  ngOnInit() {
    this.title.setTitle('RichBlok | Create-organisation');
    this.meta.updateTag({ name: 'description', content: 'Create your organisation on RichBlok to hire talents fast and free with background checks' });
    this.step = 1;
  }
  next(){
    this.step += 1;
  }
  previous(){
    this.step -= 1;
  }
  save() {
    this.currentEts.utilisateurId = this.auth.currentUser?.uid;
    this.currentEts.dateCreation = new Date();
    this.organisationSvc.save(this.currentEts).then(val => {
      this.toastr.success('Company created successfully', 'Success');
      this.router.navigate(['organisation', val.id]);
    });
  }
}

