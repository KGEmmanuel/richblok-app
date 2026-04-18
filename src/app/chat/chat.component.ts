import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from '../shared/entites/Utilisateur';
import { ChatService } from '../shared/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Auth } from '@angular/fire/auth';
import { ChatRoom } from '../shared/entites/ChatRoom';
import { Message } from '../shared/entites/Message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  showEmojiPicker = false;
  texte = true;
  newChat = false;


  iniciateText() {
    this.texte = false;
  }
  iniciatChat() {
    this.newChat = !this.newChat;
  }
  _chatid;
  set chatid(val) {
    this._chatid = val;
    this.loadmessages();
  }
  addEmoji(event) {
    const { msg } = this;
    const text = `${msg}${event.emoji.native}`;

    this.msg = text;
    this.showEmojiPicker = false;
  }

  get chatid() {
    return this._chatid;
  }
  msg;

  _receiver: string;
  destinataire: Utilisateur;

  chatroom: ChatRoom;

  set receiver(val: string) {
    this._receiver = val;
    this.usvc.getDocRef(val).onSnapshot(d => {
      this.destinataire = d.data() as Utilisateur;
      this.destinataire.id = d.id;
    })
  }
  get receiver() {
    return this._receiver;
  }
  sender: string;

  private auth = inject(Auth);

  constructor(private route: ActivatedRoute, private cht: ChatService, private usvc: UtilisateurService,
              private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Chat');
    this.meta.updateTag({ name: 'description', content: 'Connect and Chat with your RichBlok friends' });
    this.sender = this.auth.currentUser?.uid;
    if (!this.chatid) {
      this.chatid = this.route.snapshot.paramMap.get('room');
    }
  }

  loadmessages() {
    this.cht.getChatRoom(this._chatid).onSnapshot(v => {
      this.chatroom = v.data() as ChatRoom;
      this.chatroom.chatroomId = v.id;
      this.chatroom.users.forEach(v => {
        if (v !== this.sender) {
          this.receiver = v;
        }
      });
    });

  }

  sendmsg() {
    const m = new Message();
    m.message = this.msg;
    m.sender = this.sender;
    m.receiver = this.receiver;
    m.sentDate = new Date();
    m.status = 1;
    this.cht.sendMessage(m);

  }

  display(event: string) {
    this.chatid = event;
  }
}
