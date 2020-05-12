import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { ChatRoom } from 'src/app/shared/entites/ChatRoom';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-chat-users-item',
  templateUrl: './chat-users-item.component.html',
  styleUrls: ['./chat-users-item.component.scss']
})
export class ChatUsersItemComponent implements OnInit {

  otheruser: Utilisateur;
  @Output()
  selRoom: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  selUsername: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  selPhoto: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  active: boolean;
  @Input()
  chatRoom: ChatRoom;

  constructor(private chromSvc: ChatService, private userSvc: UtilisateurService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(va => {
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
    this.selUsername.emit(this.otheruser.nom + '  ' + this.otheruser.prenom);
    this.selPhoto.emit(this.otheruser.imageprofil);
  }

  chatclass() {
    if (this.active) {
      return 'chat_list active_chat';
    } else {
      return 'chat_list';
    }
  }
}
