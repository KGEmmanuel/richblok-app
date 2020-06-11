<<<<<<< HEAD
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
  datedeb;
  datefin;
  statut: string;
  owner: string;
  etatPub: string;
  passeEnFinancement: boolean;
  modeJoindre: string;
  commenditaire: string;
  refCommenditaire: string;

}
=======
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
