<<<<<<< HEAD
=======
import { Title, Meta } from '@angular/platform-browser';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

<<<<<<< HEAD
  constructor() { }

  ngOnInit() {
=======
  constructor(private title: Title, private meta : Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Notifications');
    this.meta.updateTag({ name: 'description', content: 'Get notified on al your activities on RichBlok' });
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

}
