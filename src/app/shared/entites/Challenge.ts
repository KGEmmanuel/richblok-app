import { IBaseEntity } from './IBaseEntity.class';

import { ChallengeQuestions } from './ChallengeQuestions';
import { JobSkill } from './jobSkill';

/**
 * STAR behavioral competencies unlocked by completing a challenge.
 *
 * The first 10 come from PRD v3 — classic behavioral interview competencies
 * that map to "tell me about a time you…" questions.
 *
 * The last 4 are PRD v4 AI-native competencies — emergent in the Claude
 * Code / Cursor / Codex era, not yet credentialed by any other platform.
 * These are scored by the F17 AI-pair challenge format and the F18 transcript
 * ingestion pipeline.
 */
export type CompetencyTag =
  // PRD v3 — classic behavioral
  | 'leadership'
  | 'conflict_resolution'
  | 'pressure_performance'
  | 'learning_from_failure'
  | 'teamwork'
  | 'communication'
  | 'initiative'
  | 'decision_making'
  | 'adaptability'
  | 'feedback_reception'
  // PRD v4 — AI-native (F19)
  | 'ai_pair_programming'       // can ship real features paired with an AI agent
  | 'ai_tool_orchestration'     // knows when to use Claude vs Cursor vs local vs plain code; composes tools
  | 'verification_discipline'   // catches AI hallucinations, fact-checks, pushes back on bad suggestions
  | 'ai_cost_consciousness';    // mindful of token cost; doesn't burn 10M tokens on problems a plain grep could solve

/** Challenge formats. PRD v3 had 6; v4 adds 'ai_pair'. */
export type ChallengeFormat =
  | 'solo_capstone'
  | 'team'
  | 'hackathon'
  | 'pivot'
  | 'review'
  | 'oss'
  | 'ai_pair';                  // F17 — timed broken-repo challenge with any AI tool allowed

/** AI tools the candidate may use/declare on an F17 submission. Tool-agnostic — we score outcomes, not vendors. */
export type AiTool =
  | 'claude_code'
  | 'cursor'
  | 'github_copilot'
  | 'openai_codex'
  | 'replit_agent'
  | 'windsurf'
  | 'lovable'
  | 'bolt'
  | 'v0'
  | 'other'
  | 'none';                     // baseline — no AI tool used (for control/comparison)

export class Challenge extends IBaseEntity {
  titre: string;
  objectif: string;
  objectifEtape: string;
  dateDeb;
  dateFin;
  image?: string = '/assets/rb/og-default.svg';
  description: string;
  conditionValidaation: string;
  question: string;
  creatorRef: string;
  creatorType: string; // ORG: organisation, PRS: Personne or normal user;
  language: string; // FR , EN,
  skills = [];
  type: string; // Recruitement (REC), Skill evaluation(SKILL), Free (FREE), AI_PAIR
  questions: Array<ChallengeQuestions> = [];
  duree: number = 0;
  note: number;

  // PRD v3 additions — STAR Competency Mapping
  competencyTags?: CompetencyTag[] = [];
  challengeFormat?: ChallengeFormat = 'solo_capstone';
  estimatedDuration?: string = '20 minutes';  // human-readable
  slug?: string;

  // PRD v4 F17 additions — AI-pair challenge format
  /** Markdown description of the starter code + the bug/feature to ship */
  brief?: string;
  /** Link to a public starter repo or Gist (user forks / clones) */
  starterRepoUrl?: string;
  /** Success criteria the scorer checks for (markdown bullet list) */
  successCriteria?: string;
  /** Timer in seconds. Defaults to 45 min for AI-pair. */
  timerSeconds?: number = 2700;
  /** If true, user may submit a transcript from any AI tool. */
  aiAllowed?: boolean = true;
}
