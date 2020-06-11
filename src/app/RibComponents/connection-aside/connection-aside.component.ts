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
<<<<<<< HEAD
=======
  numUsers : number;
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  constructor(private userSvc: UtilisateurService, private afAuth: AngularFireAuth) { }

  ngOnInit() {

<<<<<<< HEAD
    this.afAuth.auth.onAuthStateChanged(v=>{ 
=======
    this.afAuth.auth.onAuthStateChanged(v=>{
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
      // alert('tes test detjhsdf')
      if(v){
        this.uid = v.uid;
        this.users = this.userSvc.mightKnowUser(this.uid);
      }
<<<<<<< HEAD
      
    });
   
=======

    });

>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

}
