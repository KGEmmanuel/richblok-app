export class Notification {
  id?: string;
  owner?: string;
  titre?: string;
  description?: string;
  images?: Array<string>;
  abonnees?: Array<string>;
  typePost?: string; // Formation, Projet, ...
  refSrc?: string;
  date?: Date;

}
