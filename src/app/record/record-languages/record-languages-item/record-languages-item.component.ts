import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Langue } from 'src/app/shared/entites/Langue';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-record-languages-item',
  templateUrl: './record-languages-item.component.html',
  styleUrls: ['./record-languages-item.component.scss']
})
export class RecordLanguagesItemComponent implements OnInit {

  @Input()
  currentItem: Langue;
  @Output()
  editItem = new EventEmitter<Langue>();
  uid;
  constructor(private lngSvc: LanguageService, private agfAuth: AngularFireAuth, private toastr: ToastrService) { }

  ngOnInit() {
    if(!this.currentItem){
      this.currentItem = new Langue();
    }
    this.agfAuth.authState.subscribe(v=>{
      if(v){
        this.uid = v.uid;
      }
    })
  }

  edit(){
    this.editItem.emit(this.currentItem);
  }

  delete(){
    const bool = confirm('Do you realy want to delete this language?');
    if(!bool){
      return;
    }
    this.lngSvc.deletelanguage(this.uid,this.currentItem.id).then(()=>{
      this.toastr.success('item successfuly deleted ');
    }).catch(err=>{
      this.toastr.error('an error occured while deleting item ');
    })
  }

}
