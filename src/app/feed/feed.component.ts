import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  detail = false;
  constructor(private authSvc: AuthService) { }


  ngOnInit() {
    
    
  }

  

  showDetail(){
    this.detail = true;
  }
  hideDetail(){
    this.detail = false;
  }


}
