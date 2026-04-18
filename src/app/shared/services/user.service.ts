import { Injectable } from '@angular/core';
import { BaseService } from './BasetService.service';
import { Utilisateur } from '../entites/Utilisateur';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<Utilisateur> {

  constructor(firestore: Firestore) {
    super('utilisateurs', firestore);
  }
}
