import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../shared/services/chat.service';
import { ChatRoom } from 'src/app/shared/entites/ChatRoom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
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

  constructor(private chatsvc: ChatService) {

  }

  ngOnInit() {
    // alert('initi initiated');
    this.chatsvc.getchatrooms(firebase.auth().currentUser.uid).onSnapshot(val => {
      this.chatrooms = new Array<ChatRoom>();
      val.forEach(ch => {
        // console.log('  => '+ ch.data());
        const cr = ch.data() as ChatRoom;
        cr.chatroomId = ch.id;
        this.chatrooms.push(cr);
      });
    });


  }

  onSelect(event: string) {
    // alert(event);
    this.currentChat = event;
    this.chatRoomSel.emit(event);
  }

}
