import { Component, OnInit } from '@angular/core';
import { Challenge } from 'src/app/shared/entites/Challenge';
import { ChalengeService } from 'src/app/shared/services/chalenge.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-evaluate-list',
  templateUrl: './evaluate-list.component.html',
  styleUrls: ['./evaluate-list.component.scss']
})
export class EvaluateListComponent implements OnInit {
  showEvaluate: boolean
  form = false;
  uid;
  challenge = new Array<Challenge>();

  constructor(private chalsvc: ChalengeService, private afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.afAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
        this.chalsvc.chalengesListOf(this.uid).onSnapshot(val => {
          this.challenge = [];
          val.forEach(element => {
            const ex = element.data() as Challenge;
            ex.id = element.id;
            this.challenge.push(ex);
          });
        });
      }
    })

    this.showEvaluate = false;
  }


  createAnEvaluation() {
    this.showEvaluate = true;
  }

}
