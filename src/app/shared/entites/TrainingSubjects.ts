import { Skill } from './Skill';
export class TrainingSubject {

  subjectName: string;
  startdate;
  enddate;
  subjetskills: Array<Skill>;
 // subjectCertificat
 certificator: Array<{
   user: string;
   startdate: Date;
   enddate: Date;
 }>;
}
