export class ChatRoom {
  chatroomId: string;
  createdDate;
  users: Array<string>;
  status: string;
  type: number; // 1: chat simple, 2: chat de groupe
}
