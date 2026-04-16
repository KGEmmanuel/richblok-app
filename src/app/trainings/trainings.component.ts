import { Component, OnInit, Input } from '@angular/core';
import { Formation } from '../shared/entites/Formation';
import { FormationService } from '../shared/services/formation.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {
  @Input()
  displaymode = 'priv'; // pub


  form = false;

  currentTraining = new Formation();
  allTrainings = new Array<Formation>();
  uid;
  constructor(private formService: FormationService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(val => {
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

