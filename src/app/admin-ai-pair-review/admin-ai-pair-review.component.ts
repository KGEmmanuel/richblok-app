import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';

import {
  RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
  RbButtonComponent, RbInputComponent, RbChipComponent,
  RbIconComponent, RbEmptyStateComponent
} from '../shared/ui';

import { CompetencyTag } from '../shared/entites/Challenge';

/**
 * Admin · AI-pair submission review queue.
 *
 * Lists `pending_review_queue` items where status='pending' and gives the
 * human reviewer UI controls to either:
 *   - Approve with 4 dimension scores + feedback → server issues the badge
 *     (same weights/level logic as the automated path)
 *   - Reject with reason → no badge written
 *
 * Route is /admin/ai-pair/review, backed by 3 server endpoints under
 * /api/admin/ai-pair/. All require admin role.
 */
interface ReviewScoreDim {
  score: number | null;
  notes: string;
}

interface ReviewItem {
  id: string;
  uid: string;
  userName?: string;
  challengeId: string;
  challengeSlug?: string | null;
  challengeFormat: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'rejected_low_score';
  brief: string;
  successCriteria?: string;
  transcript: string;
  prDiff: string;
  explainer?: string;
  aiTool: string;
  elapsedSeconds: number;
  promptVersion: string;
  submittedAt: string;
}

type AiCompetency = 'ai_pair_programming' | 'ai_tool_orchestration' | 'verification_discipline' | 'ai_cost_consciousness';

@Component({
  selector: 'app-admin-ai-pair-review',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    RbCardComponent, RbCardTitleComponent, RbEyebrowComponent,
    RbButtonComponent, RbInputComponent, RbChipComponent,
    RbIconComponent, RbEmptyStateComponent
  ],
  templateUrl: './admin-ai-pair-review.component.html',
  styleUrls: ['./admin-ai-pair-review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAiPairReviewComponent implements OnInit {
  loading = true;
  errorMsg = '';
  items: ReviewItem[] = [];

  // Which item is currently open in the editor (by id). Only one at a time
  // to avoid the reviewer accidentally approving the wrong submission.
  openItemId: string | null = null;

  // Draft scores for the currently-open item. Reset when opening a new item.
  scores: Record<'correctness' | 'verification' | 'explainer' | 'cost_consciousness', ReviewScoreDim> = {
    correctness:        { score: null, notes: '' },
    verification:       { score: null, notes: '' },
    explainer:          { score: null, notes: '' },
    cost_consciousness: { score: null, notes: '' }
  };
  feedback = '';
  selectedCompetencies: Set<AiCompetency> = new Set();
  rejectReason = '';

  readonly competencyOptions: Array<{ tag: AiCompetency; label: string }> = [
    { tag: 'ai_pair_programming',     label: 'AI pair programming' },
    { tag: 'ai_tool_orchestration',   label: 'AI tool orchestration' },
    { tag: 'verification_discipline', label: 'Verification discipline' },
    { tag: 'ai_cost_consciousness',   label: 'AI cost consciousness' }
  ];

  submitting = false;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.refresh();
  }

  private async authHeader(): Promise<{ Authorization: string }> {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) throw new Error('Not signed in');
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async refresh() {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    try {
      const headers = await this.authHeader();
      const resp = await this.http
        .get<{ items: ReviewItem[]; count: number }>('/api/admin/ai-pair/pending-reviews', { headers })
        .toPromise();
      this.items = (resp && resp.items) || [];
    } catch (err: any) {
      this.errorMsg = err?.error?.error || err?.message || 'Failed to load review queue.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  openItem(item: ReviewItem) {
    this.openItemId = item.id;
    this.scores = {
      correctness:        { score: null, notes: '' },
      verification:       { score: null, notes: '' },
      explainer:          { score: null, notes: '' },
      cost_consciousness: { score: null, notes: '' }
    };
    this.feedback = '';
    this.selectedCompetencies = new Set();
    this.rejectReason = '';
    this.cdr.markForCheck();
  }

  closeItem() {
    this.openItemId = null;
    this.cdr.markForCheck();
  }

  toggleCompetency(tag: AiCompetency) {
    if (this.selectedCompetencies.has(tag)) {
      this.selectedCompetencies.delete(tag);
    } else {
      this.selectedCompetencies.add(tag);
    }
    this.cdr.markForCheck();
  }

  isCompetencySelected(tag: AiCompetency): boolean {
    return this.selectedCompetencies.has(tag);
  }

  get canApprove(): boolean {
    const dims = ['correctness', 'verification', 'explainer', 'cost_consciousness'] as const;
    return dims.every(d => {
      const s = this.scores[d].score;
      return typeof s === 'number' && s >= 0 && s <= 100;
    });
  }

  get previewOverall(): number | null {
    if (!this.canApprove) return null;
    return Math.round(
      (this.scores.correctness.score || 0)        * 0.40 +
      (this.scores.verification.score || 0)       * 0.35 +
      (this.scores.explainer.score || 0)          * 0.10 +
      (this.scores.cost_consciousness.score || 0) * 0.15
    );
  }

  get previewLevel(): string | null {
    const s = this.previewOverall;
    if (s === null || s < 60) return null;
    return s > 85 ? 'senior' : s > 70 ? 'mid' : 'junior';
  }

  async approve(item: ReviewItem) {
    if (!this.canApprove || this.submitting) return;
    this.submitting = true;
    this.cdr.markForCheck();
    try {
      const headers = await this.authHeader();
      await this.http.post(`/api/admin/ai-pair/pending-reviews/${item.id}/approve`, {
        correctness:        this.scores.correctness,
        verification:       this.scores.verification,
        explainer:          this.scores.explainer,
        cost_consciousness: this.scores.cost_consciousness,
        feedback:           this.feedback,
        aiCompetenciesDemonstrated: Array.from(this.selectedCompetencies)
      }, { headers }).toPromise();
      this.items = this.items.filter(i => i.id !== item.id);
      this.openItemId = null;
    } catch (err: any) {
      this.errorMsg = err?.error?.error || err?.message || 'Approve failed.';
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }

  async reject(item: ReviewItem) {
    if (!this.rejectReason.trim() || this.submitting) return;
    this.submitting = true;
    this.cdr.markForCheck();
    try {
      const headers = await this.authHeader();
      await this.http.post(`/api/admin/ai-pair/pending-reviews/${item.id}/reject`, {
        reason: this.rejectReason,
        reviewFeedback: this.feedback
      }, { headers }).toPromise();
      this.items = this.items.filter(i => i.id !== item.id);
      this.openItemId = null;
    } catch (err: any) {
      this.errorMsg = err?.error?.error || err?.message || 'Reject failed.';
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }

  reasonLabel(reason: string): string {
    switch (reason) {
      case 'claude_api_error':        return 'Claude API error';
      case 'scoring_format_error':    return 'Scoring format error (no tool_use)';
      case 'scoring_schema_error':    return 'Scoring schema error (bad dimension)';
      case 'scoring_not_configured':  return 'ANTHROPIC_API_KEY not set';
      default:                        return reason;
    }
  }

  formatDuration(seconds: number): string {
    const m = Math.floor((seconds || 0) / 60);
    const s = (seconds || 0) % 60;
    return `${m}m ${s}s`;
  }
}
