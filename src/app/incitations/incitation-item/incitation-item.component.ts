import { Component, OnInit, Input } from '@angular/core';
import { Incitation } from 'src/app/shared/entites/Incitation';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incitation-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incitation-item.component.html',
  styleUrls: ['./incitation-item.component.scss']
})
export class IncitationItemComponent implements OnInit {
  @Input()
  currentIncitation: Incitation;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openWithoutBackdrop(){
    if (this.currentIncitation.typeFor) {
      // alert('this one is shown  dsf');
       this.router.navigate(['/demo', this.currentIncitation.typeFor, this.currentIncitation.relatedItem]);
     } else {
       this.router.navigate(['/demo']);
     }
  }

}
