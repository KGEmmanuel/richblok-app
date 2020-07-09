import { Component, OnInit, Input } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userslist-inline-item',
  templateUrl: './userslist-inline-item.component.html',
  styleUrls: ['./userslist-inline-item.component.scss']
})
export class UserslistInlineItemComponent implements OnInit {
  @Input()
  userid: string;
  user: Utilisateur;
  constructor(private userSvc: UtilisateurService, private router: Router) {

   }

  ngOnInit(): void {
    if(this.userid){
        this.userSvc.getDocRef(this.userid).onSnapshot(us=>{
          if(us){
             this.user = us.data() as Utilisateur;
             this.user.id = us.id;
          }
        })
    }
  }

  showUser(){
     this.router.navigate(['/profile',this.userid]);
  }

}
