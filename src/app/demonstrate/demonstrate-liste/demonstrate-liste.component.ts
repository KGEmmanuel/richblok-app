import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demonstrate-liste',
  templateUrl: './demonstrate-liste.component.html',
  styleUrls: ['./demonstrate-liste.component.scss']
})
export class DemonstrateListeComponent implements OnInit {
  showDemonstrate: boolean;
  constructor() { }

  ngOnInit() {
    this.showDemonstrate = false;
  }

  demonstrate() {
    this.showDemonstrate = true;
  }

}
