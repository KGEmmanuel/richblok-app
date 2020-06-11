<<<<<<< HEAD
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
=======
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
