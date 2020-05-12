import { Media } from './Media';
export class Demonstration {
  id;
  title: string;
  description: string;
  elementType: string; // FO, CO, LAN, DOC
  content: string; //
  contentType: string;//VID, DOC, LINK, Text
  demChaleng: string;
  demDate;
  archived: boolean = false;
  contentVideo: string;
  contentFile: string;
  contentDesc: string;
  contentLink: string;
  medias: Array<Media>;
  relatedElement;

}
