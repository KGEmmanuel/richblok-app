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
}

/** A STAR Profile is generated per (user, challenge completion) tuple. */
export interface StarProfile {
  id?: string;
  uid: string;
  challengeId: string;
  challengeTitle: string;
  realisationId?: string;
  badgeId?: string;
  score?: number;
  answers: StarAnswer[];
  unlockedQuestions: string[];    // list of behavioral interview questions unlocked
  createdAt?: any;
  updatedAt?: any;
  lastCoachedAt?: any;
}

/** Human-friendly labels for each competency tag. */
export const COMPETENCY_LABELS: Record<CompetencyTag, string> = {
  leadership: 'Leadership',
  conflict_resolution: 'Conflict Resolution',
  pressure_performance: 'Pressure Performance',
  learning_from_failure: 'Learning from Failure',
  teamwork: 'Teamwork',
  communication: 'Communication',
  initiative: 'Initiative',
  decision_making: 'Decision Making',
  adaptability: 'Adaptability',
  feedback_reception: 'Feedback Reception'
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
  ]
};
