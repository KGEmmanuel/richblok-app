import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Formation } from 'src/app/shared/entites/Formation';
import { FormationService } from 'src/app/shared/services/formation.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-record-pro-train-form',
  templateUrl: './record-pro-train-form.component.html',
  styleUrls: ['./record-pro-train-form.component.scss']
})
export class RecordProTrainFormComponent implements OnInit {
  @Input()
  currentTraining: Formation;
  uid;
  onIt = false;
  @Output()
  trainingSaved = new EventEmitter<boolean>();

  constructor(private formationSvc: FormationService, private afAuth: AngularFireAuth, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(val=>{
      this.uid = val.uid;
    })
    if(!this.currentTraining) {
      this.currentTraining = new Formation();
    }
  }

  save(){
    if(this.currentTraining.id){
      this.formationSvc.update(this.uid,this.currentTraining.id, this.currentTraining).then(()=>{
        this.toastr.success("training successfully saved");
        this.trainingSaved.emit(true);
    }).catch(err=>{
      this.toastr.error("Error while saving the training"+err.message,"Ooops");
    });
    }else{
    this.formationSvc.save(this.currentTraining, this.uid).then(()=>{
        this.toastr.success("training successfully saved");
        this.trainingSaved.emit(true);
    }).catch(err=>{
      this.toastr.error("Error while saving the training"+err.message,"Ooops");
    });}
  }

  setonit(event){
    this.onIt = !this.onIt;
    this.currentTraining.formationactuelle = this.onIt;
  }





}
