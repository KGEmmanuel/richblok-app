import { Certification } from './Certification';
import { Skill } from './Skill';
import { TrainingLevel } from './TrainingLevel';
export class Formation {
  id?: string;
  idUtilisateur: string;
  idEtablissement?: string;
  libelle: string;
  etablissement: string;
  niveauFormation: string;
  typeFormation: string; // ACC, PRO, CERT
  domaineId?: string;
  domaineName: string;
  comptences: Array<Skill>;
  description: string;
  datedeb;
  datefin;
  durration: number;
  savedbyEtabs: boolean;
  dateCreation;
  formationactuelle: boolean = false;
  archived: boolean = false;
  archivedDate;
  chain = [];
  numberOfLevels: number;
  trainingLevels: Array<TrainingLevel>;
  prerequisiteTrainingref: string;
}
