import { Component, OnInit, Input, inject } from '@angular/core';
import { Message } from '../../shared/entites/Message';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
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
  private auth = inject(Auth);

  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, v => {
      if (v && this.message.receiver === v.uid) {
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
