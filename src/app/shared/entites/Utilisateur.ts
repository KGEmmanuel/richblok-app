<<<<<<< HEAD
import { IBaseEntity } from './IBaseEntity.class';


export class Utilisateur extends IBaseEntity {

  email?: string;
  nom?: string;
  prenom?: string;
  accroche?: string
  dateNaissance?;
  lieuNaissance?;
  telephone?: string;
  ville?: string;
  dateCreation?;
  typeCompte?: string;
  entreprises?: Array<string>;
  firstconexion?= true;
  // tslint:disable-next-line: max-line-length
  imageprofil?: string = 'https://firebasestorage.googleapis.com/v0/b/richblock-aebe5.appspot.com/o/backgroundimage%2Fprofil.svg.png?alt=media&token=3ff46011-fc54-4e0b-beae-2b56e8fa72be';
  imagecouv?: string = 'https?://firebasestorage.googleapis.com/v0/b/' +
    'richblock-aebe5.appspot.com/o/cover%2Ffbcover.jpg?alt=media&token=' +
    '10c4b199-0214-4ddd-a862-76094565bc02';
  poste?: string;
  lieu?: string;
  location?: string;
  abonnees?: Array<string> = new Array<string>();
  demandesabonnees?: Array<string> = new Array<string>();
  abonnementsU?: Array<string>;
  abonnementsE?: Array<string>;
  website?: string = '';
  facebook?: string = '';
  twiter?: string = '';
  googleplus?: string = '';
  linkedIn?: string = '';
  youtube?: string = '';
  instagram?: string = '';
  sexe?: string;
  lastsign?: string;
  certifkey?: string;
  config_notifSound?: boolean;
  config_messageSound?: boolean;
  config_postviews?: string; //PUB, FOL, EXCP
  config_exeptView?: Array<string>;
  config_blockeduser?: Array<string>;
  config_pin?: string;
  richcoin?= 0;
  emailVerified?= false;
  visiteurs?: Array<{ user: string, time: Date }> = [];
}
=======
import { IBaseEntity } from './IBaseEntity.class';


export class Utilisateur  extends IBaseEntity {

  email?: string;
  nom?: string;
  prenom?: string;
  accroche?: string
  dateNaissance?: Date;
  lieuNaissance?: Date;
  telephone?: string;
  ville?: string;
  dateCreation?: Date;
  typeCompte?: string;
  entreprises?: Array<string>;
  firstconexion? = true;
  imageprofil?: string = 'https?://firebasestorage.googleapis.com/v0/' +
    'b/richblock-aebe5.appspot.com/o/profiles%2FdefaultProfile.png?alt=' +
    'media&token=b29b8cae-f74e-42df-8874-e50223b735c8';
  imagecouv?: string = 'https?://firebasestorage.googleapis.com/v0/b/' +
    'richblock-aebe5.appspot.com/o/cover%2Ffbcover.jpg?alt=media&token=' +
    '10c4b199-0214-4ddd-a862-76094565bc02';
  poste?: string;
  lieu?: string;
  abonnees?: Array<string> = new Array<string>();
  demandesabonnees?: Array<string> = new Array<string>();
  abonnementsU?: Array<string>;
  abonnementsE?: Array<string>;
  website?: string = '';
  facebook?: string = '';
  twiter?: string = '';
  googleplus?: string = '';
  linkedIn?: string = '';
  youtube?: string = '';
  instagram?: string = '';
  sexe?: string;
  lastsign?: string;
  certifkey?: string;
  config_notifSound?: boolean;
  config_messageSound?: boolean;
  config_postviews?: string; //PUB, FOL, EXCP
  config_exeptView?: Array<string>;
  config_blockeduser?: Array<string>;
  config_pin?: string;
  richcoin? = 0;
  emailVerified? = false;
  visiteurs?: Array<string> = [];
  savedJobs?: Array<string> = [];
}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
