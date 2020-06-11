<<<<<<< HEAD
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
=======
import { Pays } from './Pays';
export class Entreprise {
  id?: string;
  nom: string;
    abrev: string;
    logo = 'https://firebasestorage.googleapis.com/v0/b/richblock-aebe5.appspot.com/o/organisations%2Fprofile%2Fdefault.png?alt=media&token=2ce54b61-9e94-413e-9683-17d59dc82a39';
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
