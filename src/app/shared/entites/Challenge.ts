import { IBaseEntity } from './IBaseEntity.class';

import { ChallengeQuestions } from './ChallengeQuestions';
import { JobSkill } from './jobSkill';

/** STAR behavioral competencies unlocked by completing a challenge (PRD v3) */
export type CompetencyTag =
  | 'leadership'
  | 'conflict_resolution'
  | 'pressure_performance'
  | 'learning_from_failure'
  | 'teamwork'
  | 'communication'
  | 'initiative'
  | 'decision_making'
  | 'adaptability'
  | 'feedback_reception';

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
  type: string; // Recruitement (REC), Skill evaluation(SKILL), Free (FREE)
  questions: Array<ChallengeQuestions> = [];
  duree: number = 0;
  note: number;

  // PRD v3 additions — STAR Competency Mapping
  competencyTags?: CompetencyTag[] = [];
  challengeFormat?: 'solo_capstone' | 'team' | 'hackathon' | 'pivot' | 'review' | 'oss' = 'solo_capstone';
  estimatedDuration?: string = '20 minutes';  // human-readable
  slug?: string;
}
