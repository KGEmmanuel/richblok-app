import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatRoom } from 'src/app/shared/entites/ChatRoom';
import { ChatService } from 'src/app/shared/services/chat.service';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.scss']
})
export class ChatUsersComponent implements OnInit {

  chatrooms = new Array<ChatRoom>();
  @Input()
  currentChat: string;
  uid;
  @Output()
  selUsername: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  selPhoto: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  chatRoomSel: EventEmitter<string> = new EventEmitter<string>();

  constructor(private chatsvc: ChatService, private afAuth: AngularFireAuth) {

  }

  ngOnInit() {
    // alert('initi initiated');
    this.afAuth.authState.subscribe(v => {
      if (v) {
        this.uid = v.uid;
        this.chatsvc.getchatrooms(this.uid).onSnapshot(val => {
          this.chatrooms = new Array<ChatRoom>();
          val.forEach(ch => {
            // console.log('  => '+ ch.data());
            const cr = ch.data() as ChatRoom;
            cr.chatroomId = ch.id;
            this.chatrooms.push(cr);
          });
        });
      }
    });


  }

  onSelect(event: string) {
    // alert(event);
    this.currentChat = event;
    this.chatRoomSel.emit(event);

  }

  onUsernameSel(name: string){
    this.selUsername.emit(name);
  }

  onPhotoSel(photo){
    this.selPhoto.emit(photo);
  }

}
