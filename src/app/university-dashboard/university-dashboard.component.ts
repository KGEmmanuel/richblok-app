import { Component, OnInit, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, query, where, limit } from '@angular/fire/firestore';
import { AnalyticsService } from '../shared/services/analytics.service';
import { first } from 'rxjs/operators';

interface CohortStudent {
  uid: string;
  name: string;
  challengesCompleted: number;
  badgesEarned: number;
  topScore: number;
  lastActive: any;
}

@Component({
  selector: 'app-university-dashboard',
  templateUrl: './university-dashboard.component.html',
  styleUrls: ['./university-dashboard.component.scss']
})
export class UniversityDashboardComponent implements OnInit {

  loading = true;
  students: CohortStudent[] = [];
  institutionName = 'Your Institution';
  institutionId: string | null = null;
  isPilotPreview = false;

  totalStudents = 0;
  studentsWithBadges = 0;
  totalBadges = 0;
  avgScore = 0;

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor(
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.analytics.pageView('university_dashboard');

    authState(this.auth).pipe(first()).subscribe(async user => {
      if (!user) {
        this.isPilotPreview = true;
        this.institutionName = 'Pilot preview';
        this.loadCohort(null);
        return;
      }
      // University admins have role === 'university_admin' + institution_id
      // stored on their user doc. Everyone else gets a pilot preview of the
      // global cohort so the dashboard is never empty during sales demos.
      const userSnap = await getDoc(doc(this.firestore, 'utilisateurs', user.uid));
      const u: any = userSnap.exists() ? userSnap.data() : null;
      if (u && u.role === 'university_admin' && u.institution_id) {
        this.institutionId = u.institution_id;
        this.institutionName = u.institution_name || u.institution_id;
        this.loadCohort(u.institution_id);
      } else {
        this.isPilotPreview = true;
        this.institutionName = 'Pilot preview · your cohort';
        this.loadCohort(null);
      }
    });
  }

  private loadCohort(institutionId: string | null) {
    const usersCol = collection(this.firestore, 'utilisateurs');
    const studentsQuery = institutionId
      ? query(usersCol, where('institution_id', '==', institutionId), limit(500))
      : query(usersCol, limit(200));

    Promise.all([
      getDocs(studentsQuery),
      getDocs(collection(this.firestore, 'badges'))
    ]).then(([usersSnap, badgesSnap]) => {
      const studentUids = new Set<string>(usersSnap.docs.map(d => d.id));

      // Group badges by uid, filtered to students in this cohort.
      const byUser: { [uid: string]: any[] } = {};
      badgesSnap.forEach(d => {
        const data: any = d.data();
        if (!data.uid || data.uid === 'anonymous') { return; }
        if (institutionId && !studentUids.has(data.uid)) { return; }
        (byUser[data.uid] = byUser[data.uid] || []).push({ ...data, id: d.id });
      });

      this.totalStudents = usersSnap.size;
      this.totalBadges = Object.values(byUser).reduce((s, arr) => s + arr.length, 0);
      this.studentsWithBadges = Object.keys(byUser).length;
      const allScores: number[] = [];
      for (const uid of Object.keys(byUser)) {
        for (const b of byUser[uid]) { allScores.push(b.score || 0); }
      }
      this.avgScore = allScores.length
        ? Math.round(allScores.reduce((s, n) => s + n, 0) / allScores.length)
        : 0;

      this.students = usersSnap.docs.map(d => {
        const u: any = d.data();
        const userBadges = byUser[d.id] || [];
        const name = [u.prenom, u.nom].filter(Boolean).join(' ') || u.email || '(no name)';
        return {
          uid: d.id,
          name,
          challengesCompleted: userBadges.length,
          badgesEarned: userBadges.filter(b => b.passed).length,
          topScore: userBadges.length ? Math.max(...userBadges.map(b => b.score || 0)) : 0,
          lastActive: userBadges.length ? userBadges[0].earnedAt : null
        };
      }).sort((a, b) => b.topScore - a.topScore);

      this.loading = false;
    });
  }

  exportCsv() {
    const header = 'Name,Challenges Completed,Badges Earned,Top Score,Last Active\n';
    const rows = this.students.map(s => {
      const last = s.lastActive && s.lastActive.toDate ? s.lastActive.toDate().toISOString().substring(0, 10) : '';
      return `"${s.name}",${s.challengesCompleted},${s.badgesEarned},${s.topScore},${last}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const prefix = (this.institutionId || 'richblok') + '-cohort';
    a.download = `${prefix}-${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.analytics.track('UniversityCsvExport', {
      cohortSize: this.students.length,
      institutionId: this.institutionId
    });
  }

  get activationRate(): number {
    if (this.totalStudents === 0) { return 0; }
    return Math.round((this.studentsWithBadges / this.totalStudents) * 100);
  }
}
