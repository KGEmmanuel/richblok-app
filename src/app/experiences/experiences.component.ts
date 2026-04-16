import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { Experience } from 'src/app/shared/entites/Experience';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit {
  form = false;
  uid;
  currentExperience;
  experiences = new Array<Experience>();
  @Input()
  displaymode = 'priv'; // pub

  constructor(private expSvc: ExperienceService, private afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.afAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
        this.expSvc.listExperiences(this.uid).onSnapshot(val => {
          this.experiences = [];
          val.forEach(element => {
            const ex = element.data() as Experience;
            ex.id = element.id;
            this.experiences.push(ex);
          });
        });
      }
    })
  }

}
