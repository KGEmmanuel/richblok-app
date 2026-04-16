import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-aside-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-aside-item.component.html',
  styleUrls: ['./job-aside-item.component.scss']
})
export class JobAsideItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
