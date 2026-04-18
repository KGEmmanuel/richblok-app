import { Component, OnInit, inject } from '@angular/core';
// D7 Day 2 Batch B — modular Firestore. Parallel loads now use Promise.all
// (getDocs returns a Promise directly; no .pipe(first()).toPromise() needed).
import { Firestore, collection, query, orderBy, limit, getDocs } from '@angular/fire/firestore';

interface DashboardCount {
  label: string;
  value: number | string;
  hint?: string;
  trend?: 'up' | 'flat' | 'down';
}

interface FunnelStep {
  name: string;
  count: number;
  conversion?: number;   // percent from previous step
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  loading = true;
  lastRefresh = new Date();

  // Raw counts
  totalUsers = 0;
  totalChallenges = 0;
  totalBadges = 0;
  totalParticipations = 0;
  totalReferrals = 0;
  proUsers = 0;

  // Derived
  last7dSignups = 0;
  last7dBadges = 0;
  badgesPassed = 0;

  topSkills: { skill: string; count: number }[] = [];
  recentBadges: any[] = [];
  funnel: FunnelStep[] = [];

  get mrrUsd(): number { return this.proUsers * 10; }
  get conversionRate(): number {
    return this.totalUsers > 0 ? Math.round((this.proUsers / this.totalUsers) * 1000) / 10 : 0;
  }
  get passRate(): number {
    return this.totalBadges > 0 ? Math.round((this.badgesPassed / this.totalBadges) * 1000) / 10 : 0;
  }
  get d30TargetProgress(): number {
    return Math.min(100, Math.round((this.proUsers / 100) * 1000) / 10);
  }

  get cards(): DashboardCount[] {
    return [
      { label: 'Total sign-ups', value: this.totalUsers, hint: `+${this.last7dSignups} last 7d` },
      { label: 'Paying users (Pro)', value: this.proUsers, hint: `$${this.mrrUsd} MRR` },
      { label: 'Badges earned', value: this.totalBadges, hint: `+${this.last7dBadges} last 7d` },
      { label: 'Pass rate', value: `${this.passRate}%`, hint: `${this.badgesPassed}/${this.totalBadges}` },
      { label: 'Conversion rate', value: `${this.conversionRate}%`, hint: 'free → pro' },
      { label: 'Challenges live', value: this.totalChallenges },
      { label: 'Referrals sent', value: this.totalReferrals },
      { label: 'Day-30 target', value: `${this.d30TargetProgress}%`, hint: 'of $1,000 MRR' }
    ];
  }

  private firestore = inject(Firestore);

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    this.lastRefresh = new Date();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
      const [usersSnap, challengesSnap, recentBadgesSnap, allBadgesSnap, partsSnap, refsSnap] = await Promise.all([
        getDocs(collection(this.firestore, 'utilisateurs')),
        getDocs(collection(this.firestore, 'challenges')),
        getDocs(query(collection(this.firestore, 'badges'), orderBy('earnedAt', 'desc'), limit(10))),
        getDocs(collection(this.firestore, 'badges')),
        getDocs(collection(this.firestore, 'challenge_participations')),
        getDocs(collection(this.firestore, 'referrals'))
      ]);

      // Totals
      this.totalUsers = usersSnap.size;
      this.totalChallenges = challengesSnap.size;
      this.totalBadges = allBadgesSnap.size;
      this.totalParticipations = partsSnap.size;
      this.totalReferrals = refsSnap.size;

      // Pro users
      this.proUsers = 0;
      this.last7dSignups = 0;
      usersSnap.forEach(doc => {
        const d: any = doc.data();
        if (d.subscription_tier === 'pro' || d.subscription_tier === 'team') { this.proUsers++; }
        const created = d.created_at && d.created_at.toDate ? d.created_at.toDate() : (d.dateCreation && d.dateCreation.toDate ? d.dateCreation.toDate() : null);
        if (created && created > sevenDaysAgo) { this.last7dSignups++; }
      });

      // Badge analytics
      this.last7dBadges = 0;
      this.badgesPassed = 0;
      const skillCounts: { [k: string]: number } = {};
      allBadgesSnap.forEach(doc => {
        const d: any = doc.data();
        if (d.passed) { this.badgesPassed++; }
        if (d.skill) {
          skillCounts[d.skill] = (skillCounts[d.skill] || 0) + 1;
        }
        const ts = d.earnedAt && d.earnedAt.toDate ? d.earnedAt.toDate() : null;
        if (ts && ts > sevenDaysAgo) { this.last7dBadges++; }
      });

      this.topSkills = Object.entries(skillCounts)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent badges
      this.recentBadges = recentBadgesSnap.docs.map(d => {
        const data: any = d.data();
        return {
          id: d.id,
          userName: data.userName || 'Anonymous',
          skill: data.skill || '',
          score: data.score || 0,
          passed: !!data.passed,
          earnedAt: data.earnedAt && data.earnedAt.toDate ? data.earnedAt.toDate() : null
        };
      });

      // Funnel
      this.funnel = [
        { name: 'Sign-ups', count: this.totalUsers },
        { name: 'Challenge starts', count: this.totalParticipations },
        { name: 'Badges earned', count: this.totalBadges },
        { name: 'Paid subscriptions', count: this.proUsers }
      ];
      for (let i = 1; i < this.funnel.length; i++) {
        const prev = this.funnel[i - 1].count;
        this.funnel[i].conversion = prev > 0 ? Math.round((this.funnel[i].count / prev) * 1000) / 10 : 0;
      }
    } catch (err) {
      console.error('Admin dashboard load error:', err);
    } finally {
      this.loading = false;
    }
  }
}
