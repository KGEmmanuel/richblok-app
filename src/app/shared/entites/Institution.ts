export class Institution {
    id?: string;
    idUtilisateur: string;
    idEtablissement?: string;
    libelle: string;
    etablissement: string;
    niveauFormation: string;
    typeFormation: string; // ACC, PRO, CERT
    domaineId?: string;
    domaineName: string;
    comptences: Array<string>;
    description: string;
    datedeb;
    datefin;
    savedbyEtabs: boolean;
    dateCreation;
    formationactuelle: boolean = false;
  }
