import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CommonModule } from '@angular/common';
import { ConnectionAsideItemComponent } from './connection-aside-item/connection-aside-item.component';

@Component({
  selector: 'app-connection-aside',
  standalone: true,
  imports: [CommonModule, ConnectionAsideItemComponent],
  templateUrl: './connection-aside.component.html',
  styleUrls: ['./connection-aside.component.scss']
})
export class ConnectionAsideComponent implements OnInit {

  users: Observable<Utilisateur[]>;
  uid;
  numUsers: number;
  currentUser: Utilisateur;
  constructor(private userSvc: UtilisateurService, private afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.afAuth.onAuthStateChanged(v=>{
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
