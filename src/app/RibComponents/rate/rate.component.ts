import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  closeResult: string;

   rateInString = 'Beginner';
  private rateInnumber = 0;
  @Output()
  rateChanged = new EventEmitter<number>();

  @Input()
  set currentRate(rate) {
    this.rateInnumber = rate;
    this.rateChanged.emit(this.rateInnumber);
    this.rateInString = this.checkcounter();
  }

  get currentRate() {
    return this.rateInnumber;
  }

  constructor() { }

  ngOnInit() {
  }
  // tslint:disable-next-line: align
  checkcounter(): string {

    if (this.currentRate <= 3) {
      return 'Beginner';
    }
    if (this.currentRate >= 4 && this.currentRate <= 7) {
      return 'Intermediate';
    }
    if (this.currentRate > 7) {
      return 'Expert';
    }
  }

}
