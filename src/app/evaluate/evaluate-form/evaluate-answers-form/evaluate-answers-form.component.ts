import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate-answers-form',
  templateUrl: './evaluate-answers-form.component.html',
  styleUrls: ['./evaluate-answers-form.component.scss']
})
export class EvaluateAnswersFormComponent implements OnInit {

  public step: number;
  public answer: string = '';
  nombre: number;
  formNumber = [];
  answers = [];
  showAnswers = false;
  nombreRep: number;
  hint: boolean;
  closeResult: string;
  temp:string;
  enable: boolean = false;

  constructor() {}

  ngOnInit() {
    this.step = 1;
    this.nombre = 1;
    this.hint = true;
    this.nombreRep = 0;
  }
addAnswer() {
  if (this.answer === null ||
    this.answer === undefined ||
    this.answer.length === 0) {
    alert('Fill the form before adding');
  } else {
  this.nombre += 1;
  this.formNumber.push(this.nombre) ;
  this.hint = false;
  this.showAnswers = true;
  this.nombreRep += 1;
  this.answers.push(this.answer) ;
  this.answer = '';
  }
}
deleteAnswer(i: number): void{
  this.answers.splice(i, 1);
  this.nombre -= 1;
}
modifyAnswer(i: number): void{
  this.answer = this.answers[i];
  this.enable = true;
}
confirmModification(i: number): void{
  this.answers[i] = this.answer;
  console.log(this.answer, this.answers[i]);
  alert(this.answers[i]);
  this.enable = false;
  // this.answer='';
  // console.log(this.answers);
  alert('answer modified succesfully');
}
next() {
    this.step = this.step + 1;
  }

  previous() {
    this.step = this.step - 1;
  }
}
