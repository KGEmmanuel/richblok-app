import { Component, OnInit, Input, EventEmitter, Output, inject } from '@angular/core';
import { ChatService } from '../../shared/services/chat.service';
import { ChatRoom } from 'src/app/shared/entites/ChatRoom';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {


  chatrooms = new Array<ChatRoom>();
  @Input()
  currentChat: string;

  @Output()
  chatRoomSel: EventEmitter<string> = new EventEmitter<string>();

  private auth = inject(Auth);

  constructor(private chatsvc: ChatService) {

  }

  ngOnInit() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) { return; }
    this.chatsvc.getchatrooms(uid).onSnapshot(val => {
      this.chatrooms = new Array<ChatRoom>();
      val.forEach(ch => {
        const cr = ch.data() as ChatRoom;
        cr.chatroomId = ch.id;
        this.chatrooms.push(cr);
      });
    });


  }

  onSelect(event: string) {
    this.currentChat = event;
    this.chatRoomSel.emit(event);
  }

}
