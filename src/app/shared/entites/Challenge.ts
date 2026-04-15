import { IBaseEntity } from './IBaseEntity.class';

import { ChallengeQuestions } from './ChallengeQuestions';
import { JobSkill } from './jobSkill';
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
  duree:number = 0;
  note: number;
}
