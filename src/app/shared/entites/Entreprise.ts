import { Pays } from './Pays';
export class Entreprise {
  id?: string;
  nom: string;
    abrev: string;
    logo = 'https://firebasestorage.googleapis.com/v0/b/richblock-aebe5.appspot.com/o/backgroundimage%2Fprofil.svg.png?alt=media&token=3ff46011-fc54-4e0b-beae-2b56e8fa72be';
    couverture: string;
    slogan: string;
    lienpublic: string;
    taille: number = 1;
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
    description:string;
    pays: string;
    mail: string;
    siteweb: string;
    abonnees: Array<string>;
    url: string;
    domaine: string;
    ville: string;
    createdDate;
    about: string;
}
