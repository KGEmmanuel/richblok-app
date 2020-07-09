import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  detail = false;
  constructor(private authSvc: AuthService, private title: Title, private meta: Meta ) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Feed');
    this.meta.updateTag({ name: 'description', content: 'All the RiichBlok contents can be acced from here; jobs, friends, skills, demonstrations' });
  }
  showDetail(){
    this.detail = true;
  }
  hideDetail(){
    this.detail = false;
  }
}
