import { ChallengeReponse } from './ChallengeReponses';
export class ChallengeQuestions{
  question: string;
  reponseType: string; // CM, CU, FIL, LINK, Text
  reposesPossible: Array<ChallengeReponse> = [];
  reponseKeyWord: Array<string>;
  keywordsRation: string;
  duration = 1;
}
