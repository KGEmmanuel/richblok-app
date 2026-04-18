import { Injectable, inject } from '@angular/core';
import {
  Firestore, addDoc, collection, doc, getDoc, orderBy, query, setDoc, where
} from '@angular/fire/firestore';
import { Message } from '../entites/Message';
import { ChatRoom } from '../entites/ChatRoom';
import { snapshotDoc, snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly path = 'chats';
  readonly msgPath = 'messages';

  private firestore = inject(Firestore);

  constructor() {
  }

  private chatDoc(uid: string) {
    return doc(this.firestore, this.path, uid);
  }

  private messagesCol(uid: string) {
    return collection(this.firestore, this.path, uid, this.msgPath);
  }

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
    getDoc(this.chatDoc(uid)).then(val => {
      if (val.exists()) {
        this.savemessage(uid, message);
      } else {
        const c = new ChatRoom();
        c.chatroomId = uid;
        c.createdDate = new Date();
        c.users = new Array();
        c.users.push(sender);
        c.users.push(receiver);
        c.type = 1;
        setDoc(this.chatDoc(uid), Object.assign({}, c)).then(() => {
          this.savemessage(uid, message);
        });
      }
    });
  }

  savemessage(uid: string, message: Message) {
    addDoc(this.messagesCol(uid), Object.assign({}, message)).then(() => {
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
    return snapshotQuery(query(this.messagesCol(uid), orderBy('sentDate')));
  }

  getMessagesofChat(chatId: string) {
    return snapshotQuery(query(this.messagesCol(chatId), orderBy('sentDate')));
  }

  getchatrooms(userId: string) {
    return snapshotQuery(
      query(collection(this.firestore, this.path), where('users', 'array-contains', userId))
    );
  }

  getChatRoom(id: string) {
    return snapshotDoc(this.chatDoc(id));
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
    return setDoc(this.chatDoc(uid), Object.assign({}, c)).then(() => {
      return uid;
    }).catch(() => {
      return null;
    });
  }

}
