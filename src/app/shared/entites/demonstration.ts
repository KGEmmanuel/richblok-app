<<<<<<< HEAD
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
=======
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
  viewers = new Array<string> ();

}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
