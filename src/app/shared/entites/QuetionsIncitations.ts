<<<<<<< HEAD
import { Choix } from './Choix';
export class QuetionIncitation {
    id?: string;
    question?: string;
    type?: string; // doc,OnVid,CapVid,CapPho,lien,CM(choix multiple),CU (choix unique)
    reponse?: any;
    dateCreation?;
    publier?: boolean;
    choix?: Array<Choix>;
}
=======
import { Choix } from './Choix';
export class QuetionIncitation {
    id?: string;
    question?: string;
    type?: string; // doc,OnVid,CapVid,CapPho,lien,CM(choix multiple),CU (choix unique)
    reponse?: any;
    dateCreation?: Date;
    publier?: boolean;
    choix?: Array<Choix>;
}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
