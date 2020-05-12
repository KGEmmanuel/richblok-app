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
  outilsutilises: Array<string>;
  refcadreprojet: string;
  client: string;
  positioncommanditaire: string;
  clientref: string;
  datedeb;
  datefin;
  referencescommanditaire: string;
  actionsrealises: Array<ActionRealisee>;
  medias: Array<Media>;
  encours: boolean;
}
