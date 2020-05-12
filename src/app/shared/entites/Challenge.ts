
import { ChallengeQuestions } from './ChallengeQuestions';
import { JobSkill } from './jobSkill';
export class Challenge {
  id: string;
  titre: string;
  objectif: string;
  objectifEtape: string;
  dateDeb: Date;
  dateFin: Date;
  description: string;
  conditionValidaation: string;
  question: string;
  creatorRef: string;
  creatorType: string; // ORG: organisation, PRS: Personne or normal user;
  language: string; // FR , EN,
  skillsChallenged: Array<JobSkill>;
  type: string; // Recruitement (REC), Skill evaluation(SKILL), Free (FREE)
  questions: Array<ChallengeQuestions>;
}
