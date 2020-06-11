import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
<<<<<<< HEAD
=======
import { Title, Meta } from '@angular/platform-browser';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  detail = false;
<<<<<<< HEAD
  constructor(private authSvc: AuthService) { }

  ngOnInit() {
=======
  constructor(private authSvc: AuthService, private title: Title, private meta: Meta ) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Feed');
    this.meta.updateTag({ name: 'description', content: 'All the RiichBlok contents can be acced from here; jobs, friends, skills, demonstrations' });
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }
  showDetail(){
    this.detail = true;
  }
  hideDetail(){
    this.detail = false;
  }
}
