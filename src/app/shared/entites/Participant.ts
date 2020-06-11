export class Participant {
  id?: string;
  role: string;
  noteAvg: number;
  /**
   * Tache ou Projet
   */
  niveauParticipation: string;
  /**
   * Référence du projet, si nivparticipation= projet ou ref tache si c'est tâches
   */
  referenceParticipation: string;
}
