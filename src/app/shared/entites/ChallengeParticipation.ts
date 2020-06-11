<<<<<<< HEAD
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
=======
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
