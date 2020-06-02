import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private title: Title, private meta : Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Notifications');
    this.meta.updateTag({ name: 'description', content: 'Get notified on al your activities on RichBlok' });
  }

}
