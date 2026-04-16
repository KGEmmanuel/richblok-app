import { Component, OnInit, Input } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-aside-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection-aside-item.component.html',
  styleUrls: ['./connection-aside-item.component.scss']
})
export class ConnectionAsideItemComponent implements OnInit {
  @Input()
  currentUser: Utilisateur;
  uid: string;
  constructor(private userSvc:UtilisateurService, private afAuth: AngularFireAuth, private tostSvc: ToastrService) {

   }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(v=>{
      this.uid = v.uid;
    });

  }

  askconnection() {
    alert(this.currentUser.id);
      this.userSvc.askconnection(this.uid, this.currentUser.id).then(v=>{
        this.tostSvc.success('connection request successfuly sent to'+this.currentUser.nom);
      }).catch(err=>{
        this.tostSvc.success('Ooops something went wrong : '+err.message);
      })
  }

}
