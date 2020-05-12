import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Formation } from 'src/app/shared/entites/Formation';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { FormationService } from 'src/app/shared/services/formation.service';
import { OrganisationService } from 'src/app/shared/services/organisation.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-record-pro-train-item',
  templateUrl: './record-pro-train-item.component.html',
  styleUrls: ['./record-pro-train-item.component.scss']
})
export class RecordProTrainItemComponent implements OnInit {

  @Input()
  currentItem: Formation;
  @Output()
  itemEdited = new EventEmitter<Formation>();
  etab: Entreprise;
  uid;
  @Input()
  displaymode = 'priv';

  constructor(private trainSvc: FormationService, private orgSvc:OrganisationService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    console.log('vvvvv',this.currentItem);
    this.afAuth.authState.subscribe(v=>{
      if(v){
        this.uid = v.uid;
      }
    })
    if(this.currentItem.idEtablissement){
      this.orgSvc.getDocRef(this.currentItem.idEtablissement).onSnapshot(v=>{
         this.etab = v.data() as Entreprise;
         this.etab.id = v.id;
      })
    }
  }

  edit(){
    //alert('edit');
    this.itemEdited.emit(this.currentItem);
  }

  delete(){
    const b = confirm('Do you realy want to delete this item?')
    if(b){
    this.trainSvc.delete(this.uid,this.currentItem.id)
    }
  }

}
