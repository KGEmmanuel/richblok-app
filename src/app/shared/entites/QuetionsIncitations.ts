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
