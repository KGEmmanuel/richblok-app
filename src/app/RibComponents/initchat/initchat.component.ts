import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-initchat',
  templateUrl: './initchat.component.html',
  styleUrls: ['./initchat.component.scss']
})
export class InitchatComponent implements OnInit {
  @Input()
  dest: string;
  currentuser;
  constructor(private chSvc: ChatService, private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(val => {
      this.currentuser = val.uid;
    });
  }

  initchat() {

    this.chSvc.initiateChat(this.currentuser, this.dest).then(val=>{
      const uid = val ;
     // alert('test test is' + uid);
      if (uid) {
        // this.chSvc.initiateChat()
        this.router.navigate(['/messages', uid]);
      }
    });

  }

}
