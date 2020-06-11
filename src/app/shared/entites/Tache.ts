<<<<<<< HEAD
import { CertifieElement } from './CertifieElement';

export class Tache {
  id?: string;
  libelle: string;
  competence: Array<string>;
  typetache: string; // tache elementaire, poste responsabilité
  refprojet: string;
  durre: number; // recurrente = 0
  liens: Array<string>;
  documents: Array<string>;
  participants: Array<string>;
  responsable: string;
  owner: string;
  datedebut: string;
  datefin: string;
  statut: string;
  parent: string;
  typeOwener: string; // projet, competence...
}
=======
import { CertifieElement } from './CertifieElement';

export class Tache {
  id?: string;
  libelle: string;
  competence: Array<string>;
  typetache: string; // tache elementaire, poste responsabilité
  refprojet: string;
  durre: number; // recurrente = 0
  liens: Array<string>;
  documents: Array<string>;
  participants: Array<string>;
  responsable: string;
  owner: string;
  datedebut: string;
  datefin: string;
  statut: string;
  parent: string;
  typeOwener: string; // projet, competence...
}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
