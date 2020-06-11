import { Media } from './Media';
import {ActionRealisee} from './actionrealisee'
export class Realisation {
  id?: string;
  nom: string;
  description: string;
  image: string;
  /**
   * Accadémique, professionnel, freelance
   */
  typeProj: string;
  outilsutilises: Array<string> = [];
  clientname: string;
  clientcontact: string;
  clientref: string;
  datedeb;
  datefin;
  actionsrealises: Array<ActionRealisee>;
  medias: Array<Media>;
  encours: string;
}
