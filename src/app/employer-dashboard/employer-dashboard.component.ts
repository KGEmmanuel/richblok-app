import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AnalyticsService } from '../shared/services/analytics.service';
import { CompetencyTag } from '../shared/entites/Challenge';
import { COMPETENCY_LABELS } from '../shared/entites/StarProfile';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

interface CandidateCard {
  badgeId: string;
  uid: string;
  userName: string;
  userCountry: string;
  skill: string;
  level: string;
  score: number;
  percentile?: number;
  earnedAt: any;
  passed: boolean;
}

@Component({
  selector: 'app-employer-dashboard',
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.scss']
})
export class EmployerDashboardComponent implements OnInit {

  loading = true;
  candidates: CandidateCard[] = [];
  filtered: CandidateCard[] = [];
  allSkills: string[] = [];
  allCountries: string[] = [];

  // Filters
  skillFilter = '';
  countryFilter = '';
  minScore = 60;
  passedOnly = true;
  competencyFilter: CompetencyTag | '' = '';

  readonly competencyOptions: Array<{ tag: CompetencyTag; label: string }> = [
    { tag: 'leadership', label: 'Leadership' },
    { tag: 'conflict_resolution', label: 'Conflict Resolution' },
    { tag: 'pressure_performance', label: 'Pressure Performance' },
    { tag: 'learning_from_failure', label: 'Learning from Failure' },
    { tag: 'teamwork', label: 'Teamwork' },
    { tag: 'communication', label: 'Communication' },
    { tag: 'initiative', label: 'Initiative' },
    { tag: 'decision_making', label: 'Decision Making' },
    { tag: 'adaptability', label: 'Adaptability' }
  ];

  constructor(
    private afs: AngularFirestore,
    private analytics: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.analytics.pageView('employer_dashboard');
    this.loadCandidates();
  }

  private loadCandidates() {
    this.afs.collection('badges', ref => ref.orderBy('earnedAt', 'desc').limit(200))
      .get().pipe(first()).subscribe(snap => {
        this.candidates = snap.docs.map(d => {
          const data: any = d.data();
          return {
            badgeId: d.id,
            uid: data.uid,
            userName: data.userName || 'Anonymous candidate',
            userCountry: data.userCountry || '',
            skill: data.skill || '',
            level: data.level || 'mid',
            score: data.score || 0,
            percentile: data.percentile,
            earnedAt: data.earnedAt && data.earnedAt.toDate ? data.earnedAt.toDate() : null,
            passed: !!data.passed
          };
        }).filter(c => c.uid && c.uid !== 'anonymous');

        // Build filter options
        this.allSkills = Array.from(new Set(this.candidates.map(c => c.skill).filter(Boolean))).sort();
        this.allCountries = Array.from(new Set(this.candidates.map(c => c.userCountry).filter(Boolean))).sort();

        this.applyFilters();
        this.loading = false;
      });
  }

  applyFilters() {
    this.filtered = this.candidates.filter(c => {
      if (this.skillFilter && c.skill !== this.skillFilter) { return false; }
      if (this.countryFilter && c.userCountry !== this.countryFilter) { return false; }
      if (c.score < this.minScore) { return false; }
      if (this.passedOnly && !c.passed) { return false; }
      return true;
    });
  }

  viewCandidate(c: CandidateCard) {
    this.analytics.track('EmployerViewCandidate', { uid: c.uid, skill: c.skill, score: c.score });
    this.router.navigate(['/badge', c.badgeId]);
  }

  requestIntroduction(c: CandidateCard, event: Event) {
    event.stopPropagation();
    this.analytics.track('EmployerRequestIntro', { uid: c.uid, skill: c.skill });
    // Save the request to Firestore for follow-up
    this.afs.collection('employer_intro_requests').add({
      candidateUid: c.uid,
      candidateBadgeId: c.badgeId,
      candidateName: c.userName,
      candidateSkill: c.skill,
      candidateScore: c.score,
      requestedAt: new Date(),
      status: 'pending'
    }).then(() => {
      alert(`✓ Introduction request sent for ${c.userName}. We'll email you within 48 hours with their contact details (once the employer license is active).`);
    });
  }

  get passRate(): number {
    if (this.candidates.length === 0) { return 0; }
    return Math.round((this.candidates.filter(c => c.passed).length / this.candidates.length) * 100);
  }
}
