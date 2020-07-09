import { QuetionIncitation } from './QuetionsIncitations';
import { IBaseEntity } from './IBaseEntity.class';
export class Incitation extends IBaseEntity{
    titre?: string;
    details?: string;
    dateCreation?: Date;
    id?: string;
    questions?: Array<QuetionIncitation>
    creatorid?: string;
    creatorName?: string;
    typeFor?: string; // FO: formation,
    relatedItem?: string;
    description?: string;
}
