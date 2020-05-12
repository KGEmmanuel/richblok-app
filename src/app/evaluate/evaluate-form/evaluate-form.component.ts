import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate-form',
  templateUrl: './evaluate-form.component.html',
  styleUrls: ['./evaluate-form.component.scss']
})
export class EvaluateFormComponent implements OnInit {

  public step: number;
  constructor() { }

  ngOnInit() {
    this.step = 1;
  }

  next() {
    this.step = this.step + 1;
  }

  previous() {
    this.step = this.step - 1;
  }

}
