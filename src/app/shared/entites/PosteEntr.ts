import { Skill } from './Skill';
export class PosteEntr {
  id?: string;
  libelle: string;
  descriptionposte: string;
  title: string;
  taches: Array<{
    taskName;
    taskPercentOfwork;
    taskdescription;
  }>;
  competences: Array<Skill>;
  // refdiplome_min: string;
  domaines: Array<string>;
  formations: Array<{
    diplome: string;
    domain: string;
  }>;
  posteParent: string;
  start;
  end;
  posteactuel: boolean;
  posteResponsabilite: boolean;
  occupants: Array<{
    user: string;
    deb: Date;
    end: Date;
  }>;
  occupantActuel: string;
}
