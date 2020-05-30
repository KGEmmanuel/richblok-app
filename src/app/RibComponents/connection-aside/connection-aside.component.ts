import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-connection-aside',
  templateUrl: './connection-aside.component.html',
  styleUrls: ['./connection-aside.component.scss']
})
export class ConnectionAsideComponent implements OnInit {

  users : Observable<Utilisateur[]>
  uid;
  numUsers : number;
  constructor(private userSvc: UtilisateurService, private afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged(v=>{
      // alert('tes test detjhsdf')
      if(v){
        this.uid = v.uid;
        this.users = this.userSvc.mightKnowUser(this.uid);
      }

    });

  }

}
