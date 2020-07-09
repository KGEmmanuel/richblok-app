import { Component, Inject, ElementRef, ViewChild, NgZone, OnInit, Output } from '@angular/core';
import * as turf from '@turf/turf';

import { ApiService, Maps } from './api.service';
import PlaceResult = google.maps.places.PlaceResult;
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Post } from 'src/app/shared/entites/Post';

@Component({
  selector: 'app-post-location',
  templateUrl: './post-location.component.html',
  styleUrls: ['./post-location.component.scss']
})


export class PostLocationComponent implements OnInit {
  currentPost: Post = new Post();
  @Output()

 ngOnInit(){

 }


 onAutocompleteSelected(event: PlaceResult) {
  console.log('auto', event);
}

onLocationSelected(event) {
  console.log('select', event);
}

}
