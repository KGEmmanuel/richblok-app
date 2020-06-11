import { IBaseEntity } from './IBaseEntity.class';

export class JobApplication extends IBaseEntity {
    jobref: string;
    userRef: string;

    skillsRef = new Array<string>();
    trainings= new Array<string>();
    exp = new Array<string>();
    motivation: string;
    applyingDate: Date; 
}