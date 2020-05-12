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
