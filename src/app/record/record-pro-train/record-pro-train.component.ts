import { Component, OnInit , inject } from '@angular/core';
import { Formation } from 'src/app/shared/entites/Formation';
import { FormationService } from 'src/app/shared/services/formation.service';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-record-pro-train',
  templateUrl: './record-pro-train.component.html',
  styleUrls: ['./record-pro-train.component.scss']
})
export class RecordProTrainComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);

  form = false;

  currentTraining = new Formation();
  allTrainings = new Array<Formation>();
  uid;
  constructor(private formService: FormationService) { }

  ngOnInit() {
    authState(this.auth).subscribe(val => {
      if (val) {
        this.uid = val.uid;
        this.formService.editableFormationsListQuery(this.uid).onSnapshot(val => {
          this.allTrainings = [];
          val.forEach(element => {
              const train = element.data() as Formation;
              train.id = element.id;
              this.allTrainings.push(train);
              console.log('train', train);
          });
        });
      }
    });
  }
  showForm() {
    this.form = true;
  }
  hideForm() {
    this.form = false;
  }
  dispEdit(event){
   // alert('edit2');
    this.currentTraining = event;
    this.showForm();
  }
}
