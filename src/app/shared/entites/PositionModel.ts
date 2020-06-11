<<<<<<< HEAD
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
=======
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
