import { Component, OnInit , inject } from '@angular/core';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-connection-aside',
  templateUrl: './connection-aside.component.html',
  styleUrls: ['./connection-aside.component.scss']
})
export class ConnectionAsideComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);

  users: Observable<Utilisateur[]>;
  uid;
  numUsers: number;
  currentUser: Utilisateur;
  constructor(private userSvc: UtilisateurService) { }

  ngOnInit() {

    this.auth.onAuthStateChanged(v=>{
      // alert('tes test detjhsdf')
      if (v) {
        this.uid = v.uid;
        this.userSvc.get(this.uid).subscribe(u => {
          this.users = this.userSvc.mightKnowUser(u);
          this.currentUser = u;
         });
      }

    });

  }

}
