import { Component, OnInit } from '@angular/core';
import { Challenge, CompetencyTag } from 'src/app/shared/entites/Challenge';
import { COMPETENCY_LABELS } from 'src/app/shared/entites/StarProfile';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
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
  filtered = new Array<Challenge>();
  competencyFilter: CompetencyTag | '' = '';
  slugFilter = '';

  readonly competencyOptions: Array<{ tag: CompetencyTag; label: string }> = [
    { tag: 'leadership', label: 'Leadership' },
    { tag: 'conflict_resolution', label: 'Conflict Resolution' },
    { tag: 'pressure_performance', label: 'Pressure Performance' },
    { tag: 'learning_from_failure', label: 'Learning from Failure' },
    { tag: 'teamwork', label: 'Teamwork' },
    { tag: 'communication', label: 'Communication' },
    { tag: 'initiative', label: 'Initiative' },
    { tag: 'decision_making', label: 'Decision Making' },
    { tag: 'adaptability', label: 'Adaptability' },
    { tag: 'feedback_reception', label: 'Feedback Reception' }
  ];

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    // Pre-seed filters from query params (e.g. CV verify-loop deep link).
    this.route.queryParamMap.pipe(first()).subscribe(q => {
      this.slugFilter = (q.get('slug') || '').trim();
      const comp = (q.get('comp') || '').trim() as CompetencyTag;
      if (comp && this.competencyOptions.some(o => o.tag === comp)) {
        this.competencyFilter = comp;
      }
    });

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
        this.applyFilters();
        this.analytics.track('ViewContent', { content_type: 'challenge_catalog', count: this.challenge.length });
      });
  }

  applyFilters() {
    this.filtered = this.challenge.filter(c => {
      const tags = ((c as any).competencyTags || []) as CompetencyTag[];
      if (this.competencyFilter && tags.indexOf(this.competencyFilter as CompetencyTag) < 0) {
        return false;
      }
      if (this.slugFilter) {
        const slug = (c as any).slug || '';
        if (slug !== this.slugFilter) { return false; }
      }
      return true;
    });
  }

  setCompetencyFilter(tag: CompetencyTag | '') {
    this.competencyFilter = tag;
    this.analytics.track('EvaluateCompetencyFilter', { competency: tag, resultCount: this.filtered.length });
    this.applyFilters();
  }

  clearFilters() {
    this.competencyFilter = '';
    this.slugFilter = '';
    this.applyFilters();
  }

  competencyLabel(tag: CompetencyTag): string {
    return (COMPETENCY_LABELS as any)[tag] || tag;
  }

  createAnEvaluation() {
    this.showEvaluate = true;
  }
}
