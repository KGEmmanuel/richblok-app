import { Component, OnInit, Input } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-friend-suggestion',
  templateUrl: './friend-suggestion.component.html',
  styleUrls: ['./friend-suggestion.component.scss']
})
export class FriendSuggestionComponent implements OnInit {

  loading = false;
  cancel = false;
  follow = false;
  hire = false;
  users: Observable<Utilisateur[]>;
  currentUser = new Utilisateur();
  uid;
  constructor(private usvc: UtilisateurService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(v => {
      // alert('tes test detjhsdf')
      if (v) {
        this.uid = v.uid;
        this.users = this.usvc.mightKnowUser(this.uid);
      }

    });
  }
}
