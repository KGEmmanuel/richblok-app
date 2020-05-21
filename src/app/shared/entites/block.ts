export class Block {
  id?: string;
  data?: any;
  dateCreation?: Date;
  dataref?: string;
  previous?= '';
  next?= '';
  hash;
}
