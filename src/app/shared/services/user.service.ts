import { Injectable } from '@angular/core';
import { IBaseService } from './IBaseService.service';
import { BaseService } from './BasetService.service';
import { Utilisateur } from '../entites/Utilisateur';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<Utilisateur> {

  constructor(afs: AngularFirestore) {
    const path = 'utilisateurs';
    // alert(path);
    super(path, afs);

  }
}
