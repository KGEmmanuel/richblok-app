import { Component, OnInit, Input, inject } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-initchat',
  templateUrl: './initchat.component.html',
  styleUrls: ['./initchat.component.scss']
})
export class InitchatComponent implements OnInit {
  @Input()
  dest: string;
  currentuser;

  private auth = inject(Auth);

  constructor(private chSvc: ChatService, private router: Router) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, val => {
      this.currentuser = val ? val.uid : null;
    });
  }

  initchat() {

    this.chSvc.initiateChat(this.currentuser, this.dest).then(val => {
      const uid = val;
      if (uid) {
        this.router.navigate(['/messages', uid]);
      }
    });

  }

}
