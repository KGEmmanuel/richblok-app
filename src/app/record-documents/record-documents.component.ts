import { Document } from './../shared/entites/Document';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-documents',
  templateUrl: './record-documents.component.html',
  styleUrls: ['./record-documents.component.scss']
})
export class RecordDocumentsComponent implements OnInit {

  form = false;
  // associatedUser: string;
  userDocs = new Array<Document>();
  uid;
  currentDoc : Document;
  constructor() {

  }

  ngOnInit() {

  }
  showForm() {
    this.form = true;
  }
  hideForm() {
    this.form = false;
  }
  edit(event){
    this.currentDoc = event;
    this.showForm();
  }
}
