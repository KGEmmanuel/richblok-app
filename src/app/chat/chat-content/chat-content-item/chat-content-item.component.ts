import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Message } from 'src/app/shared/entites/Message';

@Component({
  selector: 'app-chat-content-item',
  templateUrl: './chat-content-item.component.html',
  styleUrls: ['./chat-content-item.component.scss']
})
export class ChatContentItemComponent implements OnInit {
  @Input()
  message: Message;
  received: boolean;
  otheruser: Utilisateur;
  @Output()
  selUsername: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  selPhoto: EventEmitter<string> = new EventEmitter<string>();
userName : string;
userPhoto: string;
  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(v => {
      if (this.message.receiver === v.uid) {
        this.received = true;
      }
    });
  }
  sendMessage(messages, event) {
    messages.push({
      text: event.message,
      date: new Date(),
      reply: true,

    });
  }
  onUsernameSel(name: string){
    this.userName = name;
  }

  onPhotoSel(photo){
    this.userPhoto = photo;
  }
}
