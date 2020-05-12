import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Message } from '../entites/Message';
import { ChatRoom } from '../entites/ChatRoom';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private db: firebase.firestore.Firestore;
  readonly path = 'chats';
  readonly msgPath = 'messages';
  constructor() {
    this.db = firebase.firestore();
  }

  /* 98836167
    getchat(user1: string, user2: string) {
      return this.db.collection(this.path)
        .where('users', 'array-contains', user1)
        .where('users', 'array-contains', user2)
        .where('type', '==', '1');
    }
  /*
    initchat(user1: string, user2: string) {
      this.db.collection(this.path)
    }
  */

  sendMessage(message: Message) {
    const sender = message.sender;
    const receiver = message.receiver;
    message.sentDate = new Date();
    message.status = 1;

    let uid: string;
    if (sender < receiver) {
      uid = sender + receiver;
    } else {
      uid = receiver + sender;
    }
    this.db.doc(this.path + '/' + uid).get().then(val => {
      if (val.exists) {
        this.savemessage(uid, message);
      } else {
        const c = new ChatRoom();
        c.chatroomId = uid;
        c.createdDate = new Date();
        c.users = new Array();
        c.users.push(sender);
        c.users.push(receiver);
        c.type = 1;
        this.db.collection(this.path).doc(uid).set(Object.assign({}, c)).then(v => {
          this.savemessage(uid, message);
        });
      }
    });
  }

  savemessage(uid: string, message: Message) {
    this.db.collection(this.path).doc(uid).collection(this.msgPath).add(Object.assign({}, message)).then(v => {
     // this.tsvc.success('Succès','Message envoyé avec succès');
    });
  }

  getMessages(sender: string, receiver: string) {
    let uid: string;
    if (sender < receiver) {
      uid = sender + receiver;
    } else {
      uid = receiver + sender;
    }
    return this.db.collection(this.path).doc(uid).collection(this.msgPath).orderBy('sentDate');
  }

  getMessagesofChat(chatId: string) {
    const uid = chatId;
    return this.db.collection(this.path).doc(uid).collection(this.msgPath).orderBy('sentDate');
  }

  getchatrooms(userId: string) {
    return this.db.collection(this.path)
      .where('users', 'array-contains', userId);
  }

  getChatRoom(id: string) {
    return this.db.collection(this.path).doc(id);
  }

  initiateChat(sender: string, receiver: string): Promise<any> {
    let uid: string;
    if (sender < receiver) {
      uid = sender + receiver;
    } else {
      uid = receiver + sender;
    }
    const c = new ChatRoom();
    c.chatroomId = uid;
    c.createdDate = new Date();
    c.users = new Array();
    c.users.push(sender);
    c.users.push(receiver);
    c.type = 1;
    return this.db.collection(this.path).doc(uid).set(Object.assign({}, c)).then(a => {
      return uid;
    }).catch(er => {
      return null;
    });
  }

}
