import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organisation-settings',
  templateUrl: './organisation-settings.component.html',
  styleUrls: ['./organisation-settings.component.scss']
})
export class OrganisationSettingsComponent implements OnInit {
  phone = false;
  constructor() { }

  dispPhone(){
    this.phone = true;
  }
  ngOnInit() {
  }

}
