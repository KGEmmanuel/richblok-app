import { Component, OnInit } from '@angular/core';
declare const time:any;
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  // tslint:disable-next-line: ban-types
  time: Number = 0;
  constructor() { }

  ngOnInit() {
const countDownDate = new Date('Mar 10, 2020 23:00:00').getTime();

// tslint:disable-next-line: only-arrow-functions
const x = setInterval(function() {

  const now = new Date().getTime();

  const distance = countDownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('demo').innerHTML = days + ':' + hours + ':'
  + minutes + ':' + seconds + '';

  if (distance < 0) {
    clearInterval(x);
    document.getElementById('demo').innerHTML = 'EXPIRED';
  }
}, 1000);
  }


}
