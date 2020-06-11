import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Formation } from 'src/app/shared/entites/Formation';
import { FormationService } from 'src/app/shared/services/formation.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
<<<<<<< HEAD
=======
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-record-pro-train-form',
  templateUrl: './record-pro-train-form.component.html',
  styleUrls: ['./record-pro-train-form.component.scss']
})
export class RecordProTrainFormComponent implements OnInit {
  @Input()
  currentTraining: Formation;
  uid;
  onIt = true;
<<<<<<< HEAD
=======
  trainForm: FormGroup;
submitted = false;
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  @Output()
  trainingSaved = new EventEmitter<boolean>();

  constructor(private formationSvc: FormationService, private afAuth: AngularFireAuth,
<<<<<<< HEAD
              private toastr: ToastrService, private loadsvc: NgxUiLoaderService) {
=======
              private toastr: ToastrService, private loadsvc: NgxUiLoaderService, private formBuilder: FormBuilder) {
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(val=>{
      this.uid = val.uid;
    })
    if(!this.currentTraining) {
      this.currentTraining = new Formation();
    }
<<<<<<< HEAD
  }

  save(){
=======
    this.trainForm = this.formBuilder.group({
      libelle: ['', Validators.required],
      domaineName: ['', Validators.required],
      etablissement: ['', Validators.required],
      typeFormation: ['', Validators.required],
      datedeb: ['', Validators.required],
      datefin: ['', Validators.required],
      description: ['', Validators.required],
}, );
  }
  get f() { return this.trainForm.controls; }
  save(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.trainForm.invalid) {
        return;
    }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    this.loadsvc.start();
    if(this.currentTraining.id){
      this.formationSvc.update(this.uid,this.currentTraining.id, this.currentTraining).then(()=>{
        this.loadsvc.stop();
        this.toastr.success("training successfully saved");
        this.trainingSaved.emit(true);
    }).catch(err=>{
      this.loadsvc.stop();
      this.toastr.error("Error while saving the training"+err.message,"Ooops");
    });
    }else{
    this.formationSvc.save(this.currentTraining, this.uid).then(()=>{
      this.loadsvc.stop();
        this.toastr.success("training successfully saved");
        this.trainingSaved.emit(true);
    }).catch(err=>{
      this.loadsvc.stop();
      this.toastr.error("Error while saving the training"+err.message,"Ooops");
    });}
  }

  setonit(event){
    this.onIt = !this.onIt;
    this.currentTraining.datefin = null;
  }





}
