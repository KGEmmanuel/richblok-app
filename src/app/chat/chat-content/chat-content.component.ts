import { Component, OnInit, Input } from '@angular/core';
import { ChatRoom } from '../../shared/entites/ChatRoom';
import { Message } from 'src/app/shared/entites/Message';
import { ChatService } from '../../shared//services/chat.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.scss']
})
export class ChatContentComponent implements OnInit {

  _chatroom;
  @Input()
  set chatroom(val) {
    this._chatroom = val;
    this.loadmessages();
  }
  get chatroom(): string {
    return this._chatroom;
  }
  messages: Array<Message>;



  constructor(private chatSvc: ChatService) { }

  loadmessages() {
    if (!this.chatroom) {
      return;
    }
    this.chatSvc.getMessagesofChat(this._chatroom).onSnapshot(val => {
      this.messages = new Array<Message>();
      val.forEach(d => {
        const msg = d.data() as Message;
        msg.id = d.id;
        this.messages.push(msg);
      });
    });
  }

  ngOnInit() {

  }

}
