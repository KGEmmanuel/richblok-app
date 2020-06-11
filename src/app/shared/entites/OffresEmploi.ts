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
