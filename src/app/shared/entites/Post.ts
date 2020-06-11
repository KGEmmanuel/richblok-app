<<<<<<< HEAD
import { Media } from './Media';
export class Post {
  id?: string;
  icone: string;
  owner?: string;
  titre?: string;
  description?: string;
  medias?: Array<Media> = new Array();
  abonnees?: Array<string> = new Array();
  typePost?: string; // Formation, Projet, ...
  refSrc?: string;
  date?;
  location?: string;
  userSaved: string[] = new Array();
  userDel: string[] = new Array();
  debut;
  fin;
  nbreComment: number;
  descriptioncourte: string;
  competences?: string[];
  userliked?: string[] = new Array();
  userviewed?: string[] = new Array();
}
=======
import { Media } from './Media';
export class Post {
  id?: string;
  icone: string;
  owner?: string;
  titre?: string;
  description?: string;
  medias?: Array<Media> = new Array();
  abonnees?: Array<string> = new Array();
  typePost?: string; // Formation, Projet, ...
  refSrc?: string;
  date?;
  userSaved: string[] = new Array();
  userDel: string[] = new Array();
  debut: Date;
  fin: Date;
  nbreComment: number;
  descriptioncourte: string;
  competences?: string[];
  userliked?: string[] = new Array();
  userviewed?: string[] = new Array();
  location;
}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
