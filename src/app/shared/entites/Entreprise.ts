import { Pays } from './Pays';
export class Entreprise {
  id?: string;
  nom: string;
    abrev: string;
    logo = '/assets/rb/avatar-default.svg';
    couverture: string;
    slogan: string;
    lienpublic: string;
    bp: string;
    numContrib: string;
    utilisateurId: string;
    typeEntreprise: string; // Institu de formation, etablissement scolaire, service public, Expert de projet, Entreprise privé
    offreFormationPro: boolean;
    offreFormationAccad: boolean;
    offreEtudeProjet: boolean;
    offreCertifCation: boolean;
    offreEmploi: boolean;
    dateCreation;
    telephones: string;
    pays: string;
    mail: string;
    siteweb: string;
    abonnees: Array<string>;
    url: string;
    domaine: string;
    ville: string;
    createdDate: Date;
    about: string;
    taille: number;
    description:string;
}
