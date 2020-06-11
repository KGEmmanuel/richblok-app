<<<<<<< HEAD
import { Media } from './Media';
export class Document {
  id;
  documentName: string;
  documentDescription: string;
  documenttype: string; // EX, FO
  documentRelatedElmt: string;
  documentUploadDate;
  medias: Array<Media>;
  // FRIENDS, ME, PUB
  visib: string = 'ME';
  // NONE (juste save it), ORGSIGN (cetification an signature by related company), PUBSIGN(public certif includ orgsign)
  signLevel: string = 'NONE';
}
=======
import { Media } from './Media';
export class Document {
  id;
  documentName: string;
  documentDescription: string;
  documenttype: string; // EX, FO
  documentRelatedElmt: string;
  documentUploadDate;
  medias: Array<Media>;
  // FRIENDS, ME, PUB
  visib: string = 'ME';
  // NONE (juste save it), ORGSIGN (cetification an signature by related company), PUBSIGN(public certif includ orgsign)
  signLevel: string = 'NONE';
}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
