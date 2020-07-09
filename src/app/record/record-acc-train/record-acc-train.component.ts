import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-acc-train',
  templateUrl: './record-acc-train.component.html',
  styleUrls: ['./record-acc-train.component.scss']
})
export class RecordAccTrainComponent implements OnInit {
  form = false;
  constructor() { }

  ngOnInit() {
  }
showForm(){
  this.form = true;
}
hideForm(){
  this.form = false;
}
}
