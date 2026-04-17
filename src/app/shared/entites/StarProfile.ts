import { CompetencyTag } from './Challenge';

/** One STAR answer for one competency — generated from a specific project/challenge. */
export interface StarAnswer {
  competency: CompetencyTag;
  competencyLabel: string;        // human-readable e.g. "Leadership"
  question: string;               // the behavioral interview question this answers
  situation: string;              // "S" of STAR
  task: string;                   // "T" of STAR
  action: string;                 // "A" of STAR
  result: string;                 // "R" of STAR
  editedByUser?: boolean;

  // v3.1 CV-first additions
  source?: 'challenge' | 'cv' | 'linkedin' | 'manual';
  sourceExperience?: string;      // e.g. "Acme Corp · Senior Engineer" when source = 'cv'
  verified?: boolean;             // true once a matching challenge has been passed
  verifiedByBadgeId?: string;     // the badge that verified this competency
  verifiedAt?: any;
}

/** A STAR Profile is generated per (user, source) tuple. */
export interface StarProfile {
  id?: string;
  uid: string;

  // Source metadata — EITHER challenge OR CV (or both later)
  source: 'challenge' | 'cv' | 'mixed';
  challengeId?: string;
  challengeTitle?: string;
  realisationId?: string;
  badgeId?: string;
  score?: number;

  // CV mode
  cvProfileName?: string;
  cvExperienceCount?: number;
  cvProjectCount?: number;

  answers: StarAnswer[];
  unlockedQuestions: string[];
  createdAt?: any;
  updatedAt?: any;
  lastCoachedAt?: any;
}

/** Human-friendly labels for each competency tag. */
export const COMPETENCY_LABELS: Record<CompetencyTag, string> = {
  // PRD v3 classic behavioral
  leadership: 'Leadership',
  conflict_resolution: 'Conflict Resolution',
  pressure_performance: 'Pressure Performance',
  learning_from_failure: 'Learning from Failure',
  teamwork: 'Teamwork',
  communication: 'Communication',
  initiative: 'Initiative',
  decision_making: 'Decision Making',
  adaptability: 'Adaptability',
  feedback_reception: 'Feedback Reception',
  // PRD v4 AI-native (F19)
  ai_pair_programming: 'AI Pair Programming',
  ai_tool_orchestration: 'AI Tool Orchestration',
  verification_discipline: 'Verification Discipline',
  ai_cost_consciousness: 'AI Cost Consciousness'
};

/** Default behavioral questions per competency (used as fallback + seed). */
export const COMPETENCY_QUESTIONS: Record<CompetencyTag, string[]> = {
  leadership: [
    'Tell me about a time you led a team through a complex problem.',
    'Describe a time you took ownership of a project without being asked.'
  ],
  conflict_resolution: [
    'Describe a time you resolved a disagreement with a teammate.',
    'Tell me about working with someone whose style was very different from yours.'
  ],
  pressure_performance: [
    'Tell me about your most stressful professional situation.',
    'Describe a time you had to make a quick decision with limited information.'
  ],
  learning_from_failure: [
    'Tell me about a time you failed at work.',
    'Describe a time you received critical feedback — how did you respond?'
  ],
  teamwork: [
    'Give an example of working with a difficult colleague.',
    'Tell me about a team accomplishment you contributed to.'
  ],
  communication: [
    'Give me an example of explaining a technical concept to a non-technical stakeholder.',
    'Describe a time you persuaded someone to see things your way.'
  ],
  initiative: [
    'Tell me about a time you showed initiative.',
    'Describe contributing to something larger than your assigned role.'
  ],
  decision_making: [
    'Give me an example of a decision you made without all the information you needed.',
    'Tell me about a time you had to choose between two imperfect options.'
  ],
  adaptability: [
    'Describe a time you had to adjust to major changes at work.',
    'Tell me about a time your plan changed mid-project.'
  ],
  feedback_reception: [
    'Tell me about a time you received critical feedback.',
    'Describe the last time a peer review changed your work significantly.'
  ],
  // PRD v4 — AI-native competency questions
  ai_pair_programming: [
    'Walk me through a recent feature you shipped with an AI coding assistant. What was your role vs the AI\'s?',
    'Describe a time an AI tool accelerated you 3-5x on a task. What made that possible?'
  ],
  ai_tool_orchestration: [
    'Tell me about a task where you chose one AI tool over another. Why?',
    'Describe how you compose AI tools with your own judgment when shipping production code.'
  ],
  verification_discipline: [
    'Tell me about a time an AI tool confidently produced wrong output. How did you catch it?',
    'Describe your process for verifying AI-generated code before merging.'
  ],
  ai_cost_consciousness: [
    'Tell me about a time you chose NOT to use an AI tool for a task where you could have.',
    'Describe a time you reduced token cost significantly without reducing output quality.'
  ]
};
