import { Component, Inject, ElementRef, ViewChild, NgZone, OnInit } from '@angular/core';
import * as turf from '@turf/turf';

import { ApiService, Maps } from './api.service';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-post-location',
  templateUrl: './post-location.component.html',
  styleUrls: ['./post-location.component.scss']
})


export class PostLocationComponent implements OnInit {

 ngOnInit(){

 }


 onAutocompleteSelected(event: PlaceResult) {
  console.log('auto', event);
}

onLocationSelected(event) {
  console.log('select', event);
}

}
