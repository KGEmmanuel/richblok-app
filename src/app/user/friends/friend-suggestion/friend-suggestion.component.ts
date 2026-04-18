import { Component, OnInit, Input , inject } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Auth, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-friend-suggestion',
  templateUrl: './friend-suggestion.component.html',
  styleUrls: ['./friend-suggestion.component.scss']
})
export class FriendSuggestionComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);

  loading = false;
  cancel = false;
  follow = false;
  hire = false;
  users: Observable<Utilisateur[]>;
  currentUser = new Utilisateur();
  uid;
  constructor(private usvc: UtilisateurService, private userSvc: UserService) { }

  ngOnInit() {
    this.auth.onAuthStateChanged(v => {
      // alert('tes test detjhsdf')
      if (v) {
        this.uid = v.uid;
        this.userSvc.get(this.uid).subscribe(u => {
          this.users = this.usvc.mightKnowUser(u);
          this.currentUser = u;
         });
      }

    });
  }
}
