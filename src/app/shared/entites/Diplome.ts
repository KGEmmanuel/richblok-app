export class Diplome {
    id?: string;
    libelle: string;
    libcourt: string;
    paysdapplication: Array<string>;
    equivalence: number;
    niveauEtude: string; // primaire, collégiale (6em-3em), Lycée, supérieure
    typeDiplomen: string; // Accademique, Attestion de formation, Certification
}
