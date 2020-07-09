import { Skill } from './Skill';
import { EmploiFormation } from './EmploiFormation';
import { EmploiExperience } from './EmploiExperience';
import { JobSkill } from './jobSkill';
export class PositionModel {
  id?: string;
  libelle: string;
  descriptionposte: string;
  title: string;
  taches: Array<{
    taskName;
    taskPercentOfwork;
    taskdescription;
  }>;
  competences: Array<JobSkill>;
  experiences: Array<EmploiExperience>;
  // refdiplome_min: string;
  domaines: Array<string>;
  formations: Array<EmploiFormation>;
  posteResponsabilite: boolean;
  chalenges: string;
}
