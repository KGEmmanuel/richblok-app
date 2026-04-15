import { ChallengeReponse } from './../../../shared/entites/ChallengeReponses';
import { ChallengeQuestions } from './../../../shared/entites/ChallengeQuestions';
import { ChallengeParticipationAnswer } from './../../../shared/entites/ChallengeParticipationAnswer';
import { ChallengeService } from './../../../shared/services/challenge.service';
import { Component, OnInit } from '@angular/core';
import { Challenge } from 'src/app/shared/entites/Challenge';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Router, ActivatedRoute } from '@angular/router';
import { ChalengeParticipation } from 'src/app/shared/entites/ChallengeParticipation';

@Component({
  selector: 'app-participate-to-challenge',
  templateUrl: './participate-to-challenge.component.html',
  styleUrls: ['./participate-to-challenge.component.scss']
})
export class ParticipateToChallengeComponent implements OnInit {

  public etape: number;
  constructor(private router: Router, private chalSvc: ChallengeService, private route: ActivatedRoute, ) { }
  currentChal: Challenge;
  user: Utilisateur;
  show = false;
  currentAnswer = new ChallengeParticipationAnswer();
  currentparticipation: ChalengeParticipation;
  ngOnInit() {
    this.etape = 1;
    this.route.params.subscribe(routeParams => {
      const id = routeParams.id;
      this.chalSvc.getDocRef(id).onSnapshot(val => {
        this.currentChal = val.data() as Challenge;
        this.currentChal.id = val.id;
      });
    });
    this.currentChal = new Challenge();
  }
  next() {
    if (this.etape < this.currentChal.questions?.length) {
      this.etape = this.etape + 1;
      if (this.currentAnswer?.isright) {
        this.currentparticipation.globalMarks += 1;
      }
      if (!this.currentAnswer.answer) {
        this.currentAnswer.question = this.currentChal.questions[this.etape - 1].question;
        this.currentAnswer.isright = false;
      }
      this.currentparticipation.answers.push(this.currentAnswer);
      this.currentAnswer = new ChallengeParticipationAnswer();
    }
  }

  selectAnswer(event) {
    if (event.currentTarget.checked) {
      const idx = event.currentTarget.value;
      const selAns = this.currentChal.questions[this.etape - 1].reposesPossible[idx];

      this.currentAnswer.question = this.currentChal.questions[this.etape - 1].question;
      this.currentAnswer.answer = selAns.text;
      this.currentAnswer.isright = selAns.istrue === 'yes';
    }
    else {
      this.currentAnswer = new ChallengeParticipationAnswer();
    }
    alert('return' + this.currentAnswer.isright);
  }

  previous() {
    if (this.etape > 1) {
      this.etape = this.etape - 1;
    }
  }
  start() {
    this.show = true;
  }

}
