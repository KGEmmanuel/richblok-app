<<<<<<< HEAD
import { Component, Inject, ElementRef, ViewChild, NgZone, OnInit } from '@angular/core';
=======
import { Component, Inject, ElementRef, ViewChild, NgZone, OnInit, Output } from '@angular/core';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import * as turf from '@turf/turf';

import { ApiService, Maps } from './api.service';
import PlaceResult = google.maps.places.PlaceResult;
<<<<<<< HEAD
=======
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Post } from 'src/app/shared/entites/Post';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-post-location',
  templateUrl: './post-location.component.html',
  styleUrls: ['./post-location.component.scss']
})


export class PostLocationComponent implements OnInit {
<<<<<<< HEAD
=======
  currentPost: Post = new Post();
  @Output()
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

 ngOnInit(){

 }


 onAutocompleteSelected(event: PlaceResult) {
  console.log('auto', event);
}

onLocationSelected(event) {
  console.log('select', event);
}

}
