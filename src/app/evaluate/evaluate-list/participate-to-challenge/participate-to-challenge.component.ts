import { ChallengeParticipationAnswer } from './../../../shared/entites/ChallengeParticipationAnswer';
import { ChallengeService } from './../../../shared/services/challenge.service';
import { Component, OnInit } from '@angular/core';
import { Challenge } from 'src/app/shared/entites/Challenge';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Router, ActivatedRoute } from '@angular/router';
import { ChalengeParticipation } from 'src/app/shared/entites/ChallengeParticipation';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AnalyticsService } from 'src/app/shared/services/analytics.service';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-participate-to-challenge',
  templateUrl: './participate-to-challenge.component.html',
  styleUrls: ['./participate-to-challenge.component.scss']
})
export class ParticipateToChallengeComponent implements OnInit {

  public etape: number;
  currentChal: Challenge;
  user: Utilisateur;
  show = false;
  submitting = false;
  currentAnswer = new ChallengeParticipationAnswer();
  currentparticipation: ChalengeParticipation;

  constructor(
    private router: Router,
    private chalSvc: ChallengeService,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.etape = 1;
    this.currentChal = new Challenge();
    this.currentparticipation = new ChalengeParticipation();
    this.currentparticipation.globalMarks = 0;
    this.currentparticipation.answers = [];

    this.route.params.subscribe(routeParams => {
      const id = routeParams.id;
      this.chalSvc.getDocRef(id).onSnapshot(val => {
        this.currentChal = val.data() as Challenge;
        this.currentChal.id = val.id;
        this.currentparticipation.challengeRef = val.id;
      });
    });
  }

  next() {
    // End-of-challenge submit
    if (this.etape === this.currentChal.questions?.length) {
      this.recordAnswer();
      this.submit();
      return;
    }

    if (this.etape < this.currentChal.questions?.length) {
      this.recordAnswer();
      this.etape = this.etape + 1;
      this.currentAnswer = new ChallengeParticipationAnswer();
    }
  }

  private recordAnswer() {
    if (!this.currentAnswer.question) {
      this.currentAnswer.question = this.currentChal.questions[this.etape - 1]?.question || '';
      this.currentAnswer.isright = false;
    }
    if (this.currentAnswer.isright) {
      this.currentparticipation.globalMarks = (this.currentparticipation.globalMarks || 0) + 1;
    }
    this.currentparticipation.answers.push(this.currentAnswer);
  }

  async submit() {
    if (this.submitting) { return; }
    this.submitting = true;

    const totalQuestions = this.currentChal.questions?.length || 1;
    const correct = this.currentparticipation.globalMarks || 0;
    const score = Math.round((correct / totalQuestions) * 100);

    // Percentile derived from score buckets — will be refined once we have real data
    const percentile = this.scoreToPercentile(score);

    // Derive level from challenge slug or skills
    const level = this.inferLevel(this.currentChal);

    // Resolve user info
    const user = await this.afAuth.authState.pipe(first()).toPromise();

    let userName = '';
    let userAvatar = '';
    let userCountry = '';
    if (user) {
      try {
        const userDoc = await this.afs.doc(`utilisateurs/${user.uid}`).get().pipe(first()).toPromise();
        const ud: any = userDoc && userDoc.data ? userDoc.data() : null;
        if (ud) {
          userName = [ud.prenom, ud.nom].filter(Boolean).join(' ').trim() || user.displayName || user.email || '';
          userAvatar = ud.imageprofil || user.photoURL || '';
          userCountry = ud.lieu || '';
        } else {
          userName = user.displayName || user.email || '';
          userAvatar = user.photoURL || '';
        }
      } catch {
        userName = user.displayName || user.email || '';
      }
    }

    const primarySkill = (this.currentChal.skills && this.currentChal.skills[0]) || this.currentChal.titre;
    const earnedAt = firebase.firestore.FieldValue.serverTimestamp();
    const verificationHash = this.hash(`${user?.uid}|${this.currentChal.id}|${Date.now()}`);
    const passed = correct >= (this.currentChal.note || 12);

    const badgePayload: any = {
      uid: user ? user.uid : 'anonymous',
      userName,
      userAvatar,
      userCountry,
      skill: primarySkill,
      challengeId: this.currentChal.id,
      challengeTitle: this.currentChal.titre,
      level,
      score,
      correct,
      totalQuestions,
      percentile,
      earnedAt,
      verificationHash,
      passed,
      shared: false
    };

    try {
      // Save full participation record (auditable)
      this.currentparticipation.participant = user ? user.uid : 'anonymous';
      this.currentparticipation.participationDate = new Date();
      this.currentparticipation.succeed = passed;
      await this.afs.collection('challenge_participations').add({
        ...this.currentparticipation,
        score,
        percentile,
        createdAt: earnedAt
      });

      // Create badge doc
      const badgeRef = await this.afs.collection('badges').add(badgePayload);
      const badgeId = badgeRef.id;

      // Track analytics
      this.analytics.track('BadgeEarned', {
        content_type: 'badge',
        content_id: badgeId,
        skill: primarySkill,
        score,
        passed
      });

      // If they passed, fire a Lead event (valuable signup/activation signal)
      if (passed) {
        this.analytics.track('Lead', { source: 'challenge_complete', skill: primarySkill, score });
      }

      // Redirect to public badge page
      this.router.navigate(['/badge', badgeId]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to record badge', err);
      this.submitting = false;
    }
  }

  selectAnswer(event: any) {
    if (event.currentTarget.checked) {
      const idx = event.currentTarget.value;
      const selAns = this.currentChal.questions[this.etape - 1].reposesPossible[idx];
      this.currentAnswer.question = this.currentChal.questions[this.etape - 1].question;
      this.currentAnswer.answer = selAns.text;
      this.currentAnswer.isright = selAns.istrue === 'yes';
    } else {
      this.currentAnswer = new ChallengeParticipationAnswer();
    }
  }

  previous() {
    if (this.etape > 1) { this.etape = this.etape - 1; }
  }

  start() {
    this.show = true;
    this.analytics.track('ChallengeStart', { challenge_id: this.currentChal.id, skill: (this.currentChal.skills || [])[0] });
  }

  private scoreToPercentile(score: number): number {
    // Conservative mapping until we have real distribution data
    if (score >= 90) { return 95; }
    if (score >= 80) { return 80; }
    if (score >= 70) { return 65; }
    if (score >= 60) { return 50; }
    if (score >= 50) { return 35; }
    return Math.max(10, Math.round(score * 0.6));
  }

  private inferLevel(c: Challenge): 'junior' | 'mid' | 'senior' {
    const t = (c.titre || '').toLowerCase();
    if (t.includes('senior')) { return 'senior'; }
    if (t.includes('junior') || t.includes('beginner')) { return 'junior'; }
    return 'mid';
  }

  private hash(s: string): string {
    // Simple deterministic hash — NOT cryptographic, just an opaque id.
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString(36).substring(0, 10).toUpperCase();
  }
}
