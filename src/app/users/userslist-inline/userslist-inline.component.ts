import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-userslist-inline',
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
