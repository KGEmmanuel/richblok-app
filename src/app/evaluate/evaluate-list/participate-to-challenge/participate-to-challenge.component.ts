import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participate-to-challenge',
  templateUrl: './participate-to-challenge.component.html',
  styleUrls: ['./participate-to-challenge.component.scss']
})
export class ParticipateToChallengeComponent implements OnInit {
  
  public etape: number;
  constructor() { }

  ngOnInit() {
    this.etape = 1;
  }

  next() {
    this.etape = this.etape + 1;
  }

  previous() {
    this.etape = this.etape - 1;
  }

}
