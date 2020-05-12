import { TrainingSubject } from './TrainingSubjects';
export class TrainingLevel {
  levelid: number;
  levelName: string;
  levelSubjects: Array<TrainingSubject>;
  previousLevel: number;
  nextLevel: number;
}
