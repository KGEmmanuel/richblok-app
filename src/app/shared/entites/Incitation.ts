<<<<<<< HEAD
import { QuetionIncitation } from './QuetionsIncitations';
import { IBaseEntity } from './IBaseEntity.class';
export class Incitation extends IBaseEntity{
    titre?: string;
    details?: string;
    dateCreation?;
    id?: string;
    questions?: Array<QuetionIncitation>
    creatorid?: string;
    creatorName?: string;
    typeFor?: string; // FO: formation,
    relatedItem?: string;
    description?: string;
}
=======
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
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
