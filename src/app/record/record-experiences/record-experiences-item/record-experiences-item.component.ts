import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Experience } from 'src/app/shared/entites/Experience';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { ToastrService } from 'ngx-toastr';
import { OrganisationAboutComponent } from 'src/app/organisation/organisation-about/organisation-about.component';
import { Entreprise } from 'src/app/shared/entites/Entreprise';
import { OrganisationService } from 'src/app/shared/services/organisation.service';


@Component({
  selector: 'app-record-experiences-item',
  templateUrl: './record-experiences-item.component.html',
  styleUrls: ['./record-experiences-item.component.scss']
})
export class RecordExperiencesItemComponent implements OnInit {

  @Input()
  currentExperience: Experience;
  @Input()
  uid;
  org: Entreprise;
  @Output()
  selectForEdit = new EventEmitter<Experience>();

  @Input()
  displaymode = 'priv';

<<<<<<< HEAD

=======
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  constructor(private expSvc: ExperienceService, private toastSvc: ToastrService, private entSvc: OrganisationService) { }

  ngOnInit() {
    if(this.currentExperience.refEntreprise){
        this.entSvc.getDocRef(this.currentExperience.refEntreprise).onSnapshot(val=>{
          this.org = val.data() as Entreprise;
          this.org.id= val.id;
        })
    }
  }

  delete(){
    const b = confirm('Do you realy want to delete this item?')
    if(b){
    this.expSvc.delete(this.uid,this.currentExperience.id)
    }
  }

  edit(){
    this.selectForEdit.emit(this.currentExperience);
  }

}
