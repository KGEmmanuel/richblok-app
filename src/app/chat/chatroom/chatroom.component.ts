import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { ChatRoom } from '../../shared/entites/ChatRoom';
import { ChatService } from '../../shared/services/chat.service';
import { Utilisateur } from '../../shared/entites/Utilisateur';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  otheruser: Utilisateur;
  @Output()
  selRoom: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  active: boolean;
  @Input()
  chatRoom: ChatRoom;

  private auth = inject(Auth);

  constructor(private chromSvc: ChatService, private userSvc: UtilisateurService) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, va => {
      if (va) {
        if (this.chatRoom) {
          this.chatRoom.users.forEach(val => {
            if (val !== va.uid) {
              this.userSvc.getDocRef(val).onSnapshot(d => {
                this.otheruser = d.data() as Utilisateur;
                this.otheruser.id = d.id;
              });
            }
          });
        }
      }
    });
  }

  select() {
    this.selRoom.emit(this.chatRoom.chatroomId);
  }

  chatclass() {
    if (this.active) {
      return 'chat_list active_chat';
    } else {
      return 'chat_list';
    }
  }
}
