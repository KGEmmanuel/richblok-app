import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs'
import { timer } from 'rxjs/observable/timer'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() value: number
  @Output('onComplete') timerOver: EventEmitter<any> = new EventEmitter<any>();
  timerValue
  areTenSecsRemainings:boolean=false;
  constructor() { }

  ngOnInit() {
  }



}
