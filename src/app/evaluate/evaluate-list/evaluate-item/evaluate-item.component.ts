import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluate-item',
  templateUrl: './evaluate-item.component.html',
  styleUrls: ['./evaluate-item.component.scss']
})
export class EvaluateItemComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  participate() {
    this.router.navigateByUrl('/participate');
  }

}
