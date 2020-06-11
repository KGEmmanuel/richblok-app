import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Entreprise } from '../shared/entites/Entreprise';
import { OrganisationService } from '../shared/services/organisation.service';
import * as firebase from 'firebase';
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
  constructor(private organisationSvc: OrganisationService,private toastr: ToastrService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.step = 1;
  }
  next(){
    this.step += 1;
  }
  previous(){
    this.step -= 1;
  }
  save() {
    this.currentEts.utilisateurId = firebase.auth().currentUser.uid;
    this.currentEts.dateCreation = new Date();
    this.organisationSvc.save(this.currentEts).then(val => {
      this.toastr.success('Company created successfully', 'Success');
      this.router.navigate(['organisation', val.id]);
    });
  }
}

