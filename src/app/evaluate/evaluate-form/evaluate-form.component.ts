import { ChallengeReponse } from './../../shared/entites/ChallengeReponses';
import { ChallengeQuestions } from './../../shared/entites/ChallengeQuestions';
import { Component, OnInit, Input } from '@angular/core';
import { Challenge } from 'src/app/shared/entites/Challenge';
import { ToastrService } from 'ngx-toastr';
import { ChalengeService } from 'src/app/shared/services/chalenge.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-evaluate-form',
  templateUrl: './evaluate-form.component.html',
  styleUrls: ['./evaluate-form.component.scss']
})
export class EvaluateFormComponent implements OnInit {
  question = false;
  @Input()
  currentChal: Challenge;

  currentQuestion: ChallengeQuestions;
  currentReponse: ChallengeReponse;
  public step: number;
  skill: string;
  urls = [];
  files: File[] = [];
  public answer: string = '';
  nombre: number;
  formNumber = [];
  answers = [];
  showAnswers = false;
  nombreRep: number;
  hint: boolean;
  closeResult: string;
  temp: string;
  enable: boolean = false;
  mdfIdx = -1;
  check = true;
  modifcheck = false;
  nbrQuestion: number;
  uid;
  constructor(private toastr: ToastrService, private chalSvc: ChalengeService,
              private afAuth: AngularFireAuth, public router: Router,
              private loadsvc: NgxUiLoaderService) {

  }
  ngOnInit() {
    this.step = 1;
    this.currentChal = new Challenge();
    this.currentQuestion = new ChallengeQuestions();
    this.currentReponse = new ChallengeReponse();
    this.step = 1;
    this.nombre = 1;
    this.hint = true;
    this.nombreRep = 0;
    this.nbrQuestion = 1;
    this.afAuth.authState.subscribe(val => {
      if (val) {
        this.uid = val.uid;
      }
    })
  }

  next() {
    if (this.step === 1) {
      if (!this.currentChal.titre || !this.currentChal.description || this.currentChal.skills.length < 1 || !this.currentChal.note) {
        this.toastr.error('Fill all the form before going to the next step', 'Error');
        return;
      }

      else {
        this.step += 1;
      }
    }
    if (this.step === 2) {

      if (this.currentChal.questions.length < 1) {
        this.toastr.error('Add atleast one question before going to the next step', 'Error');
        return;
      }
      if(this.currentChal.note >= this.currentChal.questions.length){
        this.toastr.error('You should add more than '+ this.currentChal.note + ' questions', 'Error');
        return;
      }
      else {
        this.step += 1;
      }
    }
    else {
      this.step += 1;
    }
  }

  previous() {
    this.step = this.step - 1;
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      // this.files.push(event.target.files);
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        console.log(event.target.files[0]);
        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);

        }
        this.files.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  addTag() {
    if (this.currentChal.skills.includes(this.skill.toUpperCase())) {
      this.toastr.error('Skill alrady exist', 'Error');
      return;
    }

    this.toastr.success('Added succesfully', 'Success');
    this.currentChal.skills.push(this.skill.toUpperCase());
    this.skill = '';
  }

  deleteTag(i: number): void {
    this.currentChal.skills.splice(i, 1);
  }

  addAnswer() {
    if (this.currentReponse.text === null ||
      this.currentReponse.text === undefined ||
      this.currentReponse.text.length === 0 || this.currentReponse.istrue === '') {
      this.toastr.error('Fill the form before adding', 'Error');
    } else {
      console.log(this.currentReponse)
      if (this.currentReponse.istrue === 'yes') {
        this.check = false;
      }
      this.nombre += 1;
      this.formNumber.push(this.nombre);
      this.hint = false;
      this.showAnswers = true;
      this.nombreRep += 1;
      this.currentQuestion.reposesPossible.push(Object.assign({}, this.currentReponse));
      this.currentReponse = new ChallengeReponse();

    }

  }
  addQuestion() {
    if (!this.currentQuestion.question || !this.currentQuestion.duration || this.currentQuestion.reposesPossible.length < 1 || this.check === true) {
      this.toastr.error('Add the question, duration and atleast one correct answer before saving', 'Error');
      return;
    }
    else {
      this.currentChal.questions.push(Object.assign({}, this.currentQuestion));
      this.toastr.success('Question saved successfully', 'Success');
      this.nbrQuestion += 1;
      this.showAnswers = false;
      this.nombre = 1;
      this.check = true;
      this.currentChal.duree += this.currentQuestion.duration;
      this.currentQuestion = new ChallengeQuestions();
      this.currentReponse = new ChallengeReponse();
    }
  }

  deleteAnswer(i: number): void {
    this.currentQuestion.reposesPossible.splice(i, 1);
    this.nombre -= 1;
  }
  modifyAnswer(i: number): void {
    this.currentReponse = this.currentQuestion.reposesPossible[i];
    this.enable = true;
    this.mdfIdx = i;
    if (this.currentReponse.istrue === 'yes') {
      this.check = true;
    }
  }
  confirmModification(): void {
    if (this.currentReponse.istrue === 'yes') {
      this.check = false;
    }
    this.currentQuestion.reposesPossible[this.mdfIdx] = this.currentReponse;
    this.enable = false;
    // this.answer='';
    // console.log(this.answers);
    this.currentReponse = new ChallengeReponse();
    this.toastr.success('Modified successfully', 'Success');

  }
  save() {
    this.loadsvc.start();
    if (!this.currentChal.id) {
      this.currentChal.creatorRef = this.uid;
      this.currentChal.creatorType = 'PRS';
      this.chalSvc.save(this.currentChal).then(v => {
        this.loadsvc.stop();
        this.toastr.success('Challenge successfuly created', 'Success');
        this.currentChal = new Challenge();
        this.router.navigateByUrl('/evaluate');
      }).catch(err => {
        this.loadsvc.stop();
        this.toastr.error('An Error occured while saving your challenge: ' + err.message, 'Ooops');
      })
    }
    else {
      this.currentChal.creatorRef = this.uid;
      this.currentChal.creatorType = 'PRS';
      this.chalSvc.update(this.currentChal).then(v => {
        this.loadsvc.stop();
        this.toastr.success('Challenge successfuly created', 'Success');
        this.currentChal = new Challenge();
      }).catch(err => {
        this.loadsvc.stop();
        this.toastr.error('An Error occured while saving your challenge: ' + err.message, 'Ooops');
      })
    }
  }
  cancel(){
    this.step = 1;
  }
}
