import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-job-profile',
  templateUrl: './user-job-profile.component.html',
  styleUrls: ['./user-job-profile.component.scss']
})
export class UserJobProfileComponent implements OnInit {
  step: number;
  constructor() { }

  ngOnInit() {
    this.step = 1;
  }
  next(){
    this.step += 1;
  }
  previous(){
    this.step -= 1;
  }
}
