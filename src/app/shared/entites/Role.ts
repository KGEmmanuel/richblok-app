export class Role{
  id?:string;
  libelle: string;
  description: string;
  competence: string[];
  /**
   * Projet porteur de ce rôle
   */
  projetRef: string;
}
