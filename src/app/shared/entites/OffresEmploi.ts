<<<<<<< HEAD
import { PosteEntr } from './PosteEntr';
import { EmploiCompetence } from './EmploiCompetence';
import { EmploiExperience } from './EmploiExperience';
import { EmploiFormation } from './EmploiFormation';
import { JobSkill } from './jobSkill';
import { Preinterview } from './preinterview';

export class OffresEmploi {
  id: string;
  libelle: string;
  description: string;
  posteref: string;
  diplome: string;
  jobType: string; // FL: Free Lance,PCDD: Part time CDD, PCDI: Part time CDI  ,FCDD: full time CDD,FCDI: Full time CDI
  competencessup: Array<JobSkill>;
  experiences: Array<EmploiExperience>;
  formations: Array<EmploiFormation>;
  preinterview: Array<Preinterview> = [];
  datedeb;
  datefin;
  statut: string; // EC(en cours), CL(clôturé), AN(annulé), TR(Terminé), BR (Brouillon)
  datestatut;
  observationStatut: string;
  createDate;
  owner: string;
  ownerType: string; // org, user
  jobstartDate;
  jobduration = 0;
  renewable = 0;
  completeAddress: string;
  adressId: string;
  adressurl: string;
  location: Location;

}
=======
import { PosteEntr } from './PosteEntr';
import { EmploiCompetence } from './EmploiCompetence';
import { EmploiExperience } from './EmploiExperience';
import { EmploiFormation } from './EmploiFormation';
import { JobSkill } from './jobSkill';
import { Preinterview } from './preinterview';
import { IBaseEntity } from './IBaseEntity.class';

export class OffresEmploi extends IBaseEntity{
  libelle: string;
  description: string;
  posteref: string;
  fonction: string;
  diplome: string;
  jobType: string; // FL: Free Lance,PCDD: Part time CDD, PCDI: Part time CDI  ,FCDD: full time CDD,FCDI: Full time CDI
  competencessup: Array<JobSkill>;
  experiences: Array<EmploiExperience>;
  formations: Array<EmploiFormation>;
  preinterview: Array<Preinterview> = [];
  datedeb;
  datefin;
  statut: string = 'UP'; // EC(en cours), CL(clôturé), AN(annulé), TR(Terminé), BR (Brouillon)
  datestatut;
  observationStatut: string;
  createDate;
  ownerUser: string;
  ownerOrg: string; // org, user
  jobstartDate;
  jobduration = 0;
  renewable = 0;
  completeAddress: string;
  adressId: string;
  adressurl: string;
  location: Location;
  tags =new Array<string>();
  postulants = new Array<string>();
  recruteurs = new Array<string>();
  currentStep = 1;
  preinterviewOMarks = 0;
  preinterviewPercentageMaks = 0;

}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
