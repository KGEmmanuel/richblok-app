import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-certify-item',
  templateUrl: './certify-item.component.html',
  styleUrls: ['./certify-item.component.scss']
})
export class CertifyItemComponent implements OnInit {


  closeResult: string;
  currentRate:number = 0;
  level:string;
  constructor() {}

 // tslint:disable-next-line: align
 ratechnged(event){
  //alert(event);
 }

  ngOnInit() {
  }

}
