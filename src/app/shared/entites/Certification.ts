<<<<<<< HEAD
import { Utilisateur } from './Utilisateur';
export class Certification {
  id?: string;
  certificateur?: string;
  demandeur?: string;
  datedemande?: string;
  type?: string;
  refelement?: string;
  elttype?: string;
  dateSign?;
  observation?: string;
  niveaucote?: string;
  longitude?: number;
  lattitude?: number;
  altitude?: number;
  signature?: string;
  signkey?: string;
  certified?: boolean;
}
=======
import { Utilisateur } from './Utilisateur';
export class Certification {
  id?: string;
  certificateur?: string;
  demandeur?: string;
  datedemande?: string;
  type?: string;
  refelement?: string;
  elttype?: string;
  dateSign?: Date;
  observation?: string;
  niveaucote?: string;
  longitude?: number;
  lattitude?: number;
  altitude?: number;
  signature?: string;
  signkey?: string;
  certified?: boolean;
}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
