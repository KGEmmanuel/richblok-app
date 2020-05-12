import { Diplome } from "./Diplome";

export class OffreFormation {
  id?: string;
  idUtilisateur: string;
  idEtablissement?: string;
  libelle: string;
  etablissement: string;
  niveauFormation: string;
  typeFormation: string; // ACC, EN ENTR, PRO, CERT
  domaineId?: string;
  domaineName: string;
  comptences: Array<string>;
  description: string;
  datedeb: Date;
  datefin: Date;
  savedbyEtabs: boolean;
  dateCreation: Date;
  formationactuelle: boolean = false;
  niveEtudeMin: string;
  equivalence: number;
  diplome: Diplome;
}
