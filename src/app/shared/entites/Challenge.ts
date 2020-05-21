import { IBaseEntity } from './IBaseEntity.class';

import { ChallengeQuestions } from './ChallengeQuestions';
import { JobSkill } from './jobSkill';
export class Challenge extends IBaseEntity {
  titre: string;
  objectif: string;
  objectifEtape: string;
  dateDeb;
  dateFin;
  image?: string = "https://firebasestorage.googleapis.com/v0/b/richblock-aebe5.appspot.com/o/backgroundimage%2Fillustration-concept-questions_114360-1523.jpg?alt=media&token=9ef990cf-18a9-4bbf-a092-291cc73acaef";
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
