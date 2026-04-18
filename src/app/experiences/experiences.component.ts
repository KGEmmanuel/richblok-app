import { Component, OnInit, Output, EventEmitter, Input , inject } from '@angular/core';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { Experience } from 'src/app/shared/entites/Experience';
import { Auth, authState } from '@angular/fire/auth';
@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);
  form = false;
  uid;
  currentExperience;
  experiences = new Array<Experience>();
  @Input()
  displaymode = 'priv'; // pub

  constructor(private expSvc: ExperienceService) { }

  ngOnInit() {

    authState(this.auth).subscribe(v => {
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
