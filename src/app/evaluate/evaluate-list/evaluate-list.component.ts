import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate-list',
  templateUrl: './evaluate-list.component.html',
  styleUrls: ['./evaluate-list.component.scss']
})
export class EvaluateListComponent implements OnInit {
  showEvaluate: boolean
  constructor() { }

  ngOnInit() {
    this.showEvaluate = false;
  }

  createAnEvaluation() {
    this.showEvaluate = true;
  }

}
