import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

  totalStudents = 0;
  studentsWithBadges = 0;
  totalBadges = 0;
  avgScore = 0;

  constructor(
    private afs: AngularFirestore,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.analytics.pageView('university_dashboard');
    // MVP: aggregate all users + badges. In production this would filter by institution_id.
    Promise.all([
      this.afs.collection('utilisateurs').get().pipe(first()).toPromise(),
      this.afs.collection('badges').get().pipe(first()).toPromise()
    ]).then(([usersSnap, badgesSnap]) => {
      // Group badges by uid
      const byUser: { [uid: string]: any[] } = {};
      badgesSnap.forEach(d => {
        const data: any = d.data();
        if (!data.uid || data.uid === 'anonymous') { return; }
        (byUser[data.uid] = byUser[data.uid] || []).push({ ...data, id: d.id });
      });

      this.totalStudents = usersSnap.size;
      this.totalBadges = badgesSnap.size;
      this.studentsWithBadges = Object.keys(byUser).length;
      const allScores = badgesSnap.docs.map(d => (d.data() as any).score || 0);
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
    a.download = `richblok-cohort-${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.analytics.track('UniversityCsvExport', { cohortSize: this.students.length });
  }

  get activationRate(): number {
    if (this.totalStudents === 0) { return 0; }
    return Math.round((this.studentsWithBadges / this.totalStudents) * 100);
  }
}
