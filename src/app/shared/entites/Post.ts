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
