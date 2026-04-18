import { Component, OnInit, inject } from '@angular/core';
// D7 Day 2 Batch B — modular Firestore.
import { Firestore, collection, query, orderBy, limit, getDocs, addDoc } from '@angular/fire/firestore';
import { AnalyticsService } from '../shared/services/analytics.service';
import { CompetencyTag } from '../shared/entites/Challenge';
import { COMPETENCY_LABELS } from '../shared/entites/StarProfile';
import { Router } from '@angular/router';

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
  verifiedCompetencies: CompetencyTag[];
  // F20 / F22 — AI-native metadata aggregated across the candidate's badges.
  aiPairBadgeCount: number;              // how many of their badges are from AI-pair challenges
  aiTools: string[];                     // distinct ai_tool_used values across AI-pair badges
  aiCompetencies: string[];              // distinct ai_* competency tags across AI-pair badges
  verificationScoreMax?: number;         // max verification_score across AI-pair badges
}

// F20 — AI-native competencies as they land on badges. When any of these
// appear on a candidate's AI-pair badge, the candidate is considered
// "verified AI-native" (F22).
const AI_NATIVE_COMPETENCIES = [
  'ai_pair_programming',
  'ai_tool_orchestration',
  'verification_discipline',
  'ai_cost_consciousness'
] as const;
type AiNativeCompetency = typeof AI_NATIVE_COMPETENCIES[number];

// AI tools we've seen at scoring time. Used for the employer "filter by
// tool" dropdown. Keep in sync with Challenge.AiTool union.
const AI_TOOL_LABELS: { [k: string]: string } = {
  claude_code:    'Anthropic Claude Code',
  cursor:         'Cursor',
  github_copilot: 'GitHub Copilot',
  openai_codex:   'OpenAI Codex',
  replit_agent:   'Replit Agent',
  windsurf:       'Windsurf',
  lovable:        'Lovable',
  bolt:           'Bolt',
  v0:             'v0',
  other:          'Other',
  none:           'No AI tool'
};

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

  // F22 — verified-AI-native filters. Default off; flipping on narrows
  // results to candidates with at least one AI-pair badge.
  aiNativeOnly = false;
  aiToolFilter = '';                             // '', 'claude_code', 'cursor', ...
  aiCompetencyFilter: AiNativeCompetency | '' = '';
  minVerificationScore = 0;                      // 0..100 — candidate must hit this on any AI-pair badge
  readonly aiToolOptions = Object.keys(AI_TOOL_LABELS).map(v => ({ value: v, label: AI_TOOL_LABELS[v] }));
  readonly aiCompetencyOptions: Array<{ tag: AiNativeCompetency; label: string }> = [
    { tag: 'ai_pair_programming',     label: 'AI Pair Programming' },
    { tag: 'ai_tool_orchestration',   label: 'AI Tool Orchestration' },
    { tag: 'verification_discipline', label: 'Verification Discipline' },
    { tag: 'ai_cost_consciousness',   label: 'AI Cost Consciousness' }
  ];

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

  private firestore = inject(Firestore);

  constructor(
    private analytics: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.analytics.pageView('employer_dashboard');
    this.loadCandidates();
  }

  private loadCandidates() {
    // Badges + STAR profiles are joined by uid so the employer can filter by
    // verified behavioral competencies (not just raw skill badges).
    Promise.all([
      getDocs(query(collection(this.firestore, 'badges'), orderBy('earnedAt', 'desc'), limit(200))),
      getDocs(collection(this.firestore, 'star_profiles'))
    ]).then(([badgesSnap, profilesSnap]) => {
      // Build verified-competency index keyed by uid. A competency is "verified"
      // iff any StarAnswer the user owns has verified === true for that tag.
      const verifiedByUid: { [uid: string]: Set<CompetencyTag> } = {};
      profilesSnap.forEach(d => {
        const data: any = d.data();
        if (!data.uid) { return; }
        const set = verifiedByUid[data.uid] || new Set<CompetencyTag>();
        (data.answers || []).forEach((a: any) => {
          if (a.verified && a.competency) { set.add(a.competency); }
        });
        verifiedByUid[data.uid] = set;
      });

      // F22 — roll AI-pair badge metadata up per-uid so each candidate card
      // has a single aggregated view (candidates can own multiple badges).
      // Keyed by uid, not by badge, so a candidate who ran three AI-pair
      // challenges across Cursor + Claude Code shows both tools without
      // duplicating the card.
      const aiRollup: { [uid: string]: { count: number; tools: Set<string>; comps: Set<string>; verMax: number } } = {};
      badgesSnap.docs.forEach(d => {
        const data: any = d.data();
        if (data.challengeFormat === 'ai_pair' && data.uid) {
          const r = aiRollup[data.uid] || { count: 0, tools: new Set(), comps: new Set(), verMax: 0 };
          r.count++;
          if (typeof data.ai_tool_used === 'string') r.tools.add(data.ai_tool_used);
          if (Array.isArray(data.ai_competencies)) data.ai_competencies.forEach((t: string) => r.comps.add(t));
          if (typeof data.verification_score === 'number' && data.verification_score > r.verMax) {
            r.verMax = data.verification_score;
          }
          aiRollup[data.uid] = r;
        }
      });

      this.candidates = badgesSnap.docs.map(d => {
        const data: any = d.data();
        const rollup = aiRollup[data.uid];
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
          passed: !!data.passed,
          verifiedCompetencies: Array.from(verifiedByUid[data.uid] || []) as CompetencyTag[],
          aiPairBadgeCount: rollup ? rollup.count : 0,
          aiTools: rollup ? Array.from(rollup.tools) : [],
          aiCompetencies: rollup ? Array.from(rollup.comps) : [],
          verificationScoreMax: rollup ? rollup.verMax : undefined
        } as CandidateCard;
      }).filter(c => c.uid && c.uid !== 'anonymous');

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
      if (this.competencyFilter) {
        if (!c.verifiedCompetencies || c.verifiedCompetencies.indexOf(this.competencyFilter as CompetencyTag) < 0) {
          return false;
        }
      }
      // F22 — verified-AI-native gates. All are AND-ed with the filters above.
      if (this.aiNativeOnly && (!c.aiPairBadgeCount || c.aiPairBadgeCount === 0)) {
        return false;
      }
      if (this.aiToolFilter && c.aiTools.indexOf(this.aiToolFilter) < 0) {
        return false;
      }
      if (this.aiCompetencyFilter && c.aiCompetencies.indexOf(this.aiCompetencyFilter) < 0) {
        return false;
      }
      if (this.minVerificationScore > 0) {
        if (typeof c.verificationScoreMax !== 'number' || c.verificationScoreMax < this.minVerificationScore) {
          return false;
        }
      }
      return true;
    });
    if (this.competencyFilter) {
      this.analytics.track('EmployerCompetencyFilter', {
        competency: this.competencyFilter,
        resultCount: this.filtered.length
      });
    }
    if (this.aiNativeOnly || this.aiToolFilter || this.aiCompetencyFilter || this.minVerificationScore > 0) {
      this.analytics.track('EmployerAiNativeFilter', {
        aiNativeOnly: this.aiNativeOnly,
        aiTool: this.aiToolFilter || null,
        aiCompetency: this.aiCompetencyFilter || null,
        minVerificationScore: this.minVerificationScore,
        resultCount: this.filtered.length
      });
    }
  }

  aiToolLabel(tool: string): string {
    return AI_TOOL_LABELS[tool] || tool;
  }

  aiCompetencyLabel(tag: string): string {
    const opt = this.aiCompetencyOptions.find(o => o.tag === tag);
    return opt ? opt.label : tag;
  }

  competencyLabel(tag: CompetencyTag): string {
    return COMPETENCY_LABELS[tag] || tag;
  }

  viewCandidate(c: CandidateCard) {
    this.analytics.track('EmployerViewCandidate', { uid: c.uid, skill: c.skill, score: c.score });
    this.router.navigate(['/badge', c.badgeId]);
  }

  requestIntroduction(c: CandidateCard, event: Event) {
    event.stopPropagation();
    this.analytics.track('EmployerRequestIntro', { uid: c.uid, skill: c.skill });
    // Save the request to Firestore for follow-up
    addDoc(collection(this.firestore, 'employer_intro_requests'), {
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
