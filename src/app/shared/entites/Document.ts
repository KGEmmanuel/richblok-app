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
