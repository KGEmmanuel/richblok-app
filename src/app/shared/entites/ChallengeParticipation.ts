import { ChallengeParticipationAnswer } from './ChallengeParticipationAnswer';
import { IBaseEntity } from './IBaseEntity.class';
export class ChalengeParticipation extends IBaseEntity{

  participant: string;
  challengeRef: string;
  answers = new Array<ChallengeParticipationAnswer>();
  globalMarks: number;
  participationDuration = 0;
  participationDate;
  succeed: boolean;
}
