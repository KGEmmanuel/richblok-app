import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ChatService } from 'src/app/shared/services/chat.service';

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

  @Output()
  selUsername: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  selPhoto: EventEmitter<string> = new EventEmitter<string>();
  userPhoto: string;
  userName: string;

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
  onUsernameSel(name: string){
    this.userName = name;
  }

  onPhotoSel(photo){
    this.userPhoto = photo;
  }
  onnameSel(name: string){
    this.selUsername.emit(name);
  }

  onSel(photo){
    this.selPhoto.emit(photo);
  }
}
