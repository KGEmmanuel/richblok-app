import { Component, OnInit } from '@angular/core';
import { Challenge } from 'src/app/shared/entites/Challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { AnalyticsService } from 'src/app/shared/services/analytics.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-evaluate-list',
  templateUrl: './evaluate-list.component.html',
  styleUrls: ['./evaluate-list.component.scss']
})
export class EvaluateListComponent implements OnInit {
  showEvaluate = false;
  form = false;
  loading = true;
  challenge = new Array<Challenge>();

  constructor(
    private afs: AngularFirestore,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    // Load ALL published challenges (system + user-created) for the catalog
    this.afs.collection<Challenge>('challenges')
      .snapshotChanges()
      .subscribe(snaps => {
        this.loading = false;
        this.challenge = snaps.map(s => {
          const data = s.payload.doc.data() as Challenge;
          data.id = s.payload.doc.id;
          return data;
        });
        // Sort: system-seeded ones first (creatorType === 'SYS'), then user-created
        this.challenge.sort((a: any, b: any) => {
          const aSys = (a.creatorType === 'SYS') ? 0 : 1;
          const bSys = (b.creatorType === 'SYS') ? 0 : 1;
          if (aSys !== bSys) { return aSys - bSys; }
          return (a.titre || '').localeCompare(b.titre || '');
        });
        this.analytics.track('ViewContent', { content_type: 'challenge_catalog', count: this.challenge.length });
      });
  }

  createAnEvaluation() {
    this.showEvaluate = true;
  }
}
