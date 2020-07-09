export class Projet {
  id? : string;
  nom: string;
  description: string;
  image: string;
  /**
   * Accadémique, professionnel, freelance
   */
  typeProj: string;
  participants: string[];
  demandesAjouts: string[];
  /**
   * Réference de l'élement porteur du projet, une formation si Accademique, une expérience si professionnel, ou rien si freelance
   */
  refCadretypeProjet: string;
  datedeb: Date;
  datefin: Date;
  statut: string;
  owner: string;
  etatPub: string;
  passeEnFinancement: boolean;
  modeJoindre: string;
  commenditaire: string;
  refCommenditaire: string;

}
