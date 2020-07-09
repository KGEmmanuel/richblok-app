import { CertifieElement } from './CertifieElement';
import { Tache } from './Tache';

export class Experience {
  id?: string;
  libelle: string;
  description: string;
  entreprise: string;
  refEntreprise: string;
  typeExperience: string; // emploi, stage acc, stage pro, freelance
  liens: Array<string>;
  documents: Array<string>;
  taches: Array<Tache>;
  dateCreation: Date;
  posteactuel: boolean;
  debut: Date;
  fin: Date;
}
