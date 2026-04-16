import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserslistInlineItemComponent } from '../userslist-inline-item/userslist-inline-item.component';

@Component({
  selector: 'app-userslist-inline',
  standalone: true,
  imports: [CommonModule, UserslistInlineItemComponent],
  templateUrl: './userslist-inline.component.html',
  styleUrls: ['./userslist-inline.component.scss']
})
export class UserslistInlineComponent implements OnInit {

  @Input()
  title;
  @Input()
  users: Array<string>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
