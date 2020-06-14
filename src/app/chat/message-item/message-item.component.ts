import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../shared/entites/Message';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import * as firebase from 'firebase';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {
  chats: any[] = [
    {
      status: 'success',
      title: 'Nebular Conversational UI Success',
      messages: [
        {
          text: 'Success!',
          date: new Date(),
          reply: false,
          user: {
            name: 'Bot',
            avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png',
          },
        },
      ],
    },
  ];
  @Input()
  message: Message;
  received: boolean;
  otheruser: Utilisateur;
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
}
