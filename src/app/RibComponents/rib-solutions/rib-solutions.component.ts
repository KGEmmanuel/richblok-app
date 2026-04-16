import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rib-solutions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rib-solutions.component.html',
  styleUrls: ['./rib-solutions.component.scss']
})
export class RibSolutionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
