import { Component, OnInit, Input } from '@angular/core';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';

@Component({
  selector: 'app-similar-jobs',
  templateUrl: './similar-jobs.component.html',
  styleUrls: ['./similar-jobs.component.scss']
})
export class SimilarJobsComponent implements OnInit {

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

  }

}
