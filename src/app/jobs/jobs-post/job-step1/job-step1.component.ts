<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit, Input } from '@angular/core';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { JobSkill } from 'src/app/shared/entites/jobSkill';
import { ToastrService } from 'ngx-toastr';
import { EmploiFormation } from 'src/app/shared/entites/EmploiFormation';
<<<<<<< HEAD
=======
import PlaceResult = google.maps.places.PlaceResult;
import { OrganisationService } from 'src/app/shared/services/organisation.service';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
@Component({
  selector: 'app-job-step1',
  templateUrl: './job-step1.component.html',
  styleUrls: ['./job-step1.component.scss']
})
export class JobStep1Component implements OnInit {

  skill: JobSkill;
  offres: OffresEmploi;
<<<<<<< HEAD
  numberSkills: number;

  numberdiploma: number;
  diplome: EmploiFormation;
  constructor(private toastr: ToastrService) { }
=======
  mode: string;
  numberSkills: number;
  jobForm: FormGroup;
  submitted = false;
  numberdiploma: number;
  diplome: EmploiFormation;
  organisations : Array<Entreprise>;
  uid: string;
  constructor(private toastr: ToastrService, private orgSvc: OrganisationService, private offreSvc: OffreEmploiService,
    private afAuth: AngularFireAuth, private router: Router, private route: ActivatedRoute, private loadingSvc: NgxUiLoaderService, private formBuilder: FormBuilder) { }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

  ngOnInit() {
    this.numberSkills = 0;
    this.numberdiploma = 0;
    this.skill = new JobSkill();
    this.offres = new OffresEmploi();
    this.diplome = new EmploiFormation();
<<<<<<< HEAD
=======
    let id = this.route.snapshot.paramMap.get('id');
    let accessMode = this.route.snapshot.paramMap.get('mode');
    if(id){
       this.offreSvc.getDocRef(id).onSnapshot(sn=>{
          if(sn){
            this.offres = sn.data() as OffresEmploi;
            this.offres.id = id;
            this.numberSkills = this.offres.competencessup?.length;
            this.numberdiploma = this.offres.formations?.length;
          }
       })
    }
    else{
      this.offres = new OffresEmploi();
    }

    this.afAuth.authState.subscribe(v=>{
       if(v)
       {
         this.uid = v.uid;
         this.orgSvc.getorganisationsof(this.uid).onSnapshot(orgs=>{
           this.organisations = [];
              orgs.forEach(item=>{
                const org = item.data() as Entreprise;
                org.id = item.id;
                  this.organisations.push(org);
              })
         });
       }

    })
    this.jobForm = this.formBuilder.group({
      ownerOrg: ['', Validators.required],
      libelle: ['', Validators.required],
      jobType: ['', Validators.required],
      fonction: ['', Validators.required],
      datedeb: ['', Validators.required],
      datefin: ['', Validators.required],
      description: ['', Validators.required],
      statut: ['', Validators.required],
}, );
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

  addSkill() {
    this.pushSkill();
  }
  addDiploma(){
    this.pushDiploma();
  }

  deleteSkill(i: number): void {
    this.offres.competencessup.splice(i, 1);
  }
  deleteDiploma(i: number): void {
    this.offres.competencessup.splice(i, 1);
  }
<<<<<<< HEAD

=======
  get f() { return this.jobForm.controls; }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  pushSkill() {
    if (!this.offres.competencessup) {
      this.offres.competencessup = [];
    }
    const res = this.offres.competencessup.find(al => al.skillName.toUpperCase() === this.skill.skillName.toUpperCase());
    console.log(res);
    if (res) {
      this.toastr.error('skill already added', 'Error');
      return;
    }
<<<<<<< HEAD
    this.offres.competencessup.push(this.skill);
=======
    this.offres.competencessup.push(Object.assign({}, this.skill));
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    this.skill = new JobSkill();
    this.numberSkills += 1;
    this.toastr.success('Skill added succesfully', 'Success');
  }
  pushDiploma() {
    if (!this.offres.formations) {
      this.offres.formations = [];
    }
    const res = this.offres.formations.find(al => al.nomDiplome.toUpperCase() === this.diplome.nomDiplome.toUpperCase());
    console.log(res);
    if (res) {
      this.toastr.error('Diploma already added', 'Error');
      return;
    }
<<<<<<< HEAD
    this.offres.formations.push(this.diplome);
=======
    this.offres.formations.push(Object.assign({}, this.diplome));
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    this.diplome = new EmploiFormation();
    this.numberdiploma += 1;
    this.toastr.success('Diploma added succesfully', 'Success');
  }

<<<<<<< HEAD
=======
  onAutocompleteSelected(event: PlaceResult) {
    console.log('auto', event);
    this.offres.adressId = event.id;
    this.offres.adressurl = event.url;
    this.offres.completeAddress = event.adr_address;
  }

  onLocationSelected(event) {
    console.log('select', event);

  }

  save(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.jobForm.invalid) {
        return;
    }
    if(this.numberSkills<1 || this.numberdiploma<1){
      this.toastr.error('You must enter atleat one skill and one diploma','Error');
      return;
    }
    this.loadingSvc.start();
    this.offres.ownerUser  = this.uid;
    if(this.offres.id){
      this.offreSvc.update(this.offres).then(val=>{
        this.toastr.success('Job Offer saved', 'Success');
        this.router.navigate(['jobs']);
      }).catch(err=>{
        this.toastr.error(err.message);
      }).finally(()=>{
         this.loadingSvc.stop();
      })
    }
    else{
      this.offreSvc.save(this.offres).then(val=>{
        this.toastr.success('Job Offer saved', 'Success');
        this.router.navigate(['jobs']);

      }).catch(err=>{
        this.toastr.error(err.message);
      }).finally(()=>{
        this.loadingSvc.stop()
      })
    }


  }

>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
}
