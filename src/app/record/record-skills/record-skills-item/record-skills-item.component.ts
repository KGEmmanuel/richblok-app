import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { Skill } from '../../../shared/entites/Skill';
import { SkillsService } from '../../../shared/services/skills.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
<<<<<<< HEAD
=======
import { NgxUiLoaderService } from 'ngx-ui-loader';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-record-skills-item',
  templateUrl: './record-skills-item.component.html',
  styleUrls: ['./record-skills-item.component.scss']
})
export class RecordSkillsItemComponent implements OnInit {
  @Output()
  itemEdited = new EventEmitter<Skill>();
  @Input()
  currentSkill: Skill;
  @Input()
  userid: string;
  constructor( private skilSvc: SkillsService,
<<<<<<< HEAD
    private toasterSvc: ToastrService) { }
=======
    private toasterSvc: ToastrService, private loadingSvc: NgxUiLoaderService) { }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

  ngOnInit() {
  }

  delete(){
<<<<<<< HEAD
    const b = confirm('Do you realy want to delete this item?')
    if(b){
    this.skilSvc.delete(this.userid,this.currentSkill.id)
=======
    this.loadingSvc.start()
    const b = confirm('Do you realy want to delete this item?')
    if(b){
    this.skilSvc.delete(this.userid,this.currentSkill.id).then(v=>{
      this.toasterSvc.success('Item successuly deleted')
      this.loadingSvc.stop()
    }).catch(err=>{
      this.toasterSvc.error('An error occured :'+err.message)
      this.loadingSvc.stop()
    })
   
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
    }
  }
  edit(){
    this.itemEdited.emit(this.currentSkill);
  }

}
