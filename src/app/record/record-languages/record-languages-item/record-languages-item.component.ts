import { Component, OnInit, Input, Output, EventEmitter , inject } from '@angular/core';
import { Langue } from 'src/app/shared/entites/Langue';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Auth, authState } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-record-languages-item',
  templateUrl: './record-languages-item.component.html',
  styleUrls: ['./record-languages-item.component.scss']
})
export class RecordLanguagesItemComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);

  @Input()
  currentItem: Langue;
  @Output()
  editItem = new EventEmitter<Langue>();
  uid;
  constructor(private lngSvc: LanguageService, private agfAuth: Auth, private toastr: ToastrService) { }

  ngOnInit() {
    if(!this.currentItem){
      this.currentItem = new Langue();
    }
    authState(this.agfAuth).subscribe(v=>{
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
