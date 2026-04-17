import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';

import {
  RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
  RbButtonComponent, RbInputComponent, RbChipComponent,
  RbIconComponent, RbStatComponent, RbEmptyStateComponent
} from '../shared/ui';

import { Challenge, AiTool, CompetencyTag } from '../shared/entites/Challenge';
import { COMPETENCY_LABELS } from '../shared/entites/StarProfile';
import { AnalyticsService } from '../shared/services/analytics.service';

/**
 * Steps in the AI-pair challenge flow. Each maps to a visual state
 * (no modal; just conditional rendering of sections).
 */
type Step = 'loading' | 'brief' | 'submit' | 'scoring' | 'result' | 'error';

interface ScoreDim {
  score: number;
  notes: string;
}

interface ScoreResult {
  mode: 'ai' | 'fallback' | 'fallback_error' | 'fallback_parse_error';
  scores: {
    correctness:        ScoreDim;
    verification:       ScoreDim;
    explainer:          ScoreDim;
    cost_consciousness: ScoreDim;
    overall:            { score: number; percentile: number; passed: boolean };
  };
  feedback: string;
  aiCompetenciesDemonstrated: CompetencyTag[];
  recommendedBadge: { earned: boolean; level: string; competencyTags: CompetencyTag[] };
}

/**
 * F17 — AI-pair challenge.
 *
 *   /ai-pair/:slug        → loads challenge from Firestore `challenges` collection
 *                           with matching slug + challengeFormat='ai_pair'
 *
 * The candidate goes through 3 phases:
 *   1. brief    — reads the broken-repo description, clicks "Start timer"
 *   2. submit   — pastes PR diff + transcript (+ optional explainer); timer
 *                 runs visually on screen
 *   3. result   — /api/ai-pair/score returns 4-dimension score + feedback
 *                 + badge recommendation. If earned, we write a `badges`
 *                 Firestore doc with `ai_tool_used` metadata.
 *
 * All UI uses the V5 kit components from src/app/shared/ui/.
 */
@Component({
  selector: 'app-ai-pair-challenge',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
    RbButtonComponent, RbInputComponent, RbChipComponent,
    RbIconComponent, RbStatComponent, RbEmptyStateComponent,
  ],
  templateUrl: './ai-pair-challenge.component.html',
  styleUrls: ['./ai-pair-challenge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiPairChallengeComponent implements OnInit, OnDestroy {

  step: Step = 'loading';
  errorMsg = '';

  challenge: Challenge | null = null;
  slug = '';

  // Submission form fields
  aiToolUsed: AiTool = 'claude_code';
  prDiff = '';
  transcript = '';
  explainer = '';

  // Timer state
  startedAt: number | null = null;
  elapsedSeconds = 0;
  timerIntervalId: any = null;
  timerSeconds = 2700;        // 45 min default; overridden from challenge.timerSeconds

  // Score result
  score: ScoreResult | null = null;

  // AI tool options for the dropdown — tool-agnostic per PRD v4 §2.6
  readonly aiToolOptions: Array<{ value: AiTool; label: string }> = [
    { value: 'claude_code',    label: 'Anthropic Claude Code' },
    { value: 'cursor',         label: 'Cursor' },
    { value: 'github_copilot', label: 'GitHub Copilot' },
    { value: 'openai_codex',   label: 'OpenAI Codex / Codex CLI' },
    { value: 'replit_agent',   label: 'Replit Agent' },
    { value: 'windsurf',       label: 'Windsurf' },
    { value: 'lovable',        label: 'Lovable' },
    { value: 'bolt',           label: 'Bolt' },
    { value: 'v0',             label: 'Vercel v0' },
    { value: 'other',          label: 'Other AI tool' },
    { value: 'none',           label: 'No AI tool (baseline)' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private analytics: AnalyticsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!this.slug) {
      this.errorMsg = 'Challenge slug missing from URL.';
      this.step = 'error';
      return;
    }
    this.loadChallenge();
  }

  ngOnDestroy() {
    if (this.timerIntervalId) { clearInterval(this.timerIntervalId); }
  }

  private loadChallenge() {
    this.analytics.pageView('ai_pair_challenge');
    this.afs.collection<Challenge>('challenges', ref =>
      ref.where('slug', '==', this.slug).limit(1)
    ).get().pipe(first()).subscribe(snap => {
      if (snap.empty) {
        this.errorMsg = 'This AI-pair challenge could not be found. Check the link or browse the catalog.';
        this.step = 'error';
        this.cdr.markForCheck();
        return;
      }
      const doc = snap.docs[0];
      this.challenge = { ...(doc.data() as Challenge), id: doc.id } as Challenge;
      if (this.challenge.timerSeconds) {
        this.timerSeconds = this.challenge.timerSeconds;
      }
      this.step = 'brief';
      this.analytics.track('AiPairChallengeViewed', {
        slug: this.slug,
        challengeId: this.challenge.id
      });
      this.cdr.markForCheck();
    });
  }

  startChallenge() {
    if (!this.challenge) { return; }
    this.startedAt = Date.now();
    this.elapsedSeconds = 0;
    this.step = 'submit';
    this.analytics.track('AiPairChallengeStarted', {
      slug: this.slug,
      challengeId: this.challenge.id,
      aiTool: this.aiToolUsed
    });
    this.timerIntervalId = setInterval(() => {
      if (this.startedAt) {
        this.elapsedSeconds = Math.floor((Date.now() - this.startedAt) / 1000);
        this.cdr.markForCheck();
      }
    }, 1000);
  }

  get remainingSeconds(): number {
    return Math.max(0, this.timerSeconds - this.elapsedSeconds);
  }

  get timerDisplay(): string {
    const s = this.remainingSeconds;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  get timerOver(): boolean {
    return this.remainingSeconds === 0;
  }

  /** Human-readable total-duration minutes for the brief CTA. */
  get timerMinutes(): number {
    return Math.floor(this.timerSeconds / 60);
  }

  /** Can submit when all required fields are filled AND we've passed at least 60 seconds (sanity check). */
  get canSubmit(): boolean {
    return !!this.prDiff.trim() && !!this.transcript.trim() && this.elapsedSeconds >= 60;
  }

  async submitWork() {
    if (!this.challenge || !this.canSubmit) { return; }
    if (this.timerIntervalId) { clearInterval(this.timerIntervalId); }
    this.step = 'scoring';
    this.cdr.markForCheck();

    const user = await this.afAuth.authState.pipe(first()).toPromise();
    const uid = user ? user.uid : 'anonymous';
    const userName = user ? (user.displayName || user.email || '') : '';

    this.analytics.track('AiPairChallengeSubmitted', {
      slug: this.slug,
      challengeId: this.challenge.id,
      aiTool: this.aiToolUsed,
      elapsedSeconds: this.elapsedSeconds,
      prDiffLength: this.prDiff.length,
      transcriptLength: this.transcript.length,
      hasExplainer: !!this.explainer.trim()
    });

    try {
      const resp = await this.http.post<ScoreResult>('/api/ai-pair/score', {
        challengeId:     this.challenge.id,
        challengeTitle:  this.challenge.titre,
        brief:           this.challenge.brief || this.challenge.description,
        successCriteria: this.challenge.successCriteria || this.challenge.conditionValidaation,
        transcript:      this.transcript,
        prDiff:          this.prDiff,
        explainer:       this.explainer,
        aiToolUsed:      this.aiToolUsed,
        userName,
        uid,
        elapsedSeconds:  this.elapsedSeconds
      }).toPromise();

      this.score = resp!;
      this.step = 'result';
      this.cdr.markForCheck();

      this.analytics.track('AiPairChallengeScored', {
        slug: this.slug,
        challengeId: this.challenge.id,
        overall: resp!.scores.overall.score,
        passed: resp!.scores.overall.passed,
        mode: resp!.mode
      });

      // If passed, write a badge record with AI-tool metadata
      if (resp!.recommendedBadge.earned && uid !== 'anonymous') {
        await this.issueBadge(resp!, userName, uid);
      }
    } catch (err) {
      const e: any = err;
      this.errorMsg = e?.error?.error || e?.message || 'Scoring failed. Your work is not lost — try again.';
      this.step = 'error';
      this.cdr.markForCheck();
    }
  }

  private async issueBadge(result: ScoreResult, userName: string, uid: string) {
    if (!this.challenge) { return; }
    try {
      const badgeRef = await this.afs.collection('badges').add({
        uid,
        userName,
        skill: (this.challenge.skills || [])[0] || 'AI-Pair',
        level: result.recommendedBadge.level,
        score: result.scores.overall.score,
        percentile: result.scores.overall.percentile,
        passed: result.scores.overall.passed,
        earnedAt: new Date(),
        challengeId: this.challenge.id,
        challengeSlug: this.challenge.slug,
        challengeFormat: 'ai_pair',
        // F20 additions — tool-agnostic badge metadata
        ai_tool_used: this.aiToolUsed,
        ai_competencies: result.aiCompetenciesDemonstrated,
        verification_score: result.scores.verification.score,
        cost_consciousness_score: result.scores.cost_consciousness.score
      });
      this.analytics.track('BadgeEarned', {
        content_type: 'badge',
        content_id: badgeRef.id,
        challengeFormat: 'ai_pair',
        aiTool: this.aiToolUsed
      });
    } catch (err) {
      console.warn('[ai-pair] badge write failed:', err);
    }
  }

  competencyLabel(tag: CompetencyTag): string {
    return (COMPETENCY_LABELS as any)[tag] || tag;
  }

  retry() {
    this.step = 'brief';
    this.score = null;
    this.errorMsg = '';
    this.prDiff = '';
    this.transcript = '';
    this.explainer = '';
    this.elapsedSeconds = 0;
    this.startedAt = null;
    this.cdr.markForCheck();
  }
}
