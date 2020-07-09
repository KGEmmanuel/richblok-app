import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-realisation-details',
  templateUrl: './record-realisation-details.component.html',
  styleUrls: ['./record-realisation-details.component.scss']
})
export class RecordRealisationDetailsComponent implements OnInit {
  currentRealisation;
  constructor() { }

  ngOnInit(): void {
  }

}
