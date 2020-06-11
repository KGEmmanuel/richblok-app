<<<<<<< HEAD
import { Skill } from './Skill';
export class TrainingSubject {

  subjectName: string;
  startdate;
  enddate;
  subjetskills: Array<Skill>;
 // subjectCertificat
 certificator: Array<{
   user: string;
   startdate;
   enddate;
 }>;
}
=======
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
