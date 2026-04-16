import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demonstrate-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demonstrate-item.component.html',
  styleUrls: ['./demonstrate-item.component.scss']
})
export class DemonstrateItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
