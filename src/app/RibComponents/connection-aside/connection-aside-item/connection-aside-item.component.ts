import { Component, OnInit, Input } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-connection-aside-item',
  templateUrl: './connection-aside-item.component.html',
  styleUrls: ['./connection-aside-item.component.scss']
})
export class ConnectionAsideItemComponent implements OnInit {
  @Input()
  currentUser: Utilisateur;
  uid: string;
  constructor(private userSvc:UtilisateurService, private afAuth: AngularFireAuth, private tostSvc: ToastrService) {
<<<<<<< HEAD
    
=======

>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
   }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(v=>{
      this.uid = v.uid;
    });

  }

  askconnection() {
    alert(this.currentUser.id);
      this.userSvc.askconnection(this.uid, this.currentUser.id).then(v=>{
        this.tostSvc.success('connection request successfuly sent to'+this.currentUser.nom);
      }).catch(err=>{
<<<<<<< HEAD
        this.tostSvc.success('Ooops something goes wrong : '+err.message);
=======
        this.tostSvc.success('Ooops something went wrong : '+err.message);
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
      })
  }

}
