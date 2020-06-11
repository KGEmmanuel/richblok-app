<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit, Input } from '@angular/core';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe

@Component({
  selector: 'app-similar-jobs',
  templateUrl: './similar-jobs.component.html',
  styleUrls: ['./similar-jobs.component.scss']
})
export class SimilarJobsComponent implements OnInit {

<<<<<<< HEAD
  constructor() { }

  ngOnInit() {
=======
  @Input()
  joboffer: OffresEmploi;

  similarjobs = new Array<OffresEmploi>();

  constructor(private jobSvc: OffreEmploiService) { }

  ngOnInit() {
    if (this.joboffer) {
      this.jobSvc.offresByTag(this.joboffer.tags).onSnapshot(v => {
        this.similarjobs = [];
        v.forEach(jb => {
          const j = jb.data() as OffresEmploi;
          j.id = jb.id;
          this.similarjobs.push(j)
        })

      })
    }

>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

}
