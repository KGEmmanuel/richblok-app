export class Message {
  id?: string;
  message: string;
  sender: string;
  receiver: string;
  userdelete: string;
  sentDate;
  quote: string;
  status?: number; // 1: sent, 2: delivered, 3: readed
  readDate;
}
