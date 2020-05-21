import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Skill } from '../entites/Skill';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private afs = firebase.firestore();
  readonly skillPath = 'skills';

  constructor(private userSvc: UtilisateurService) {
    // this.skillPath = this.userSvc.competencePath;
  }

  adduserSkill(userid: string, sk: Skill) {
    const p = this.userSvc.path + '/' + userid + '/' + this.skillPath;
    return this.afs.collection(p).add({ ...sk, dateCreation: new Date() });
  }

  updateuserSkill(userid: string, sk: Skill) {
    const p = this.userSvc.path + '/' + userid + '/' + this.skillPath;
    return this.afs.collection(p).doc(sk.id).update({ ...sk});
  }

  getAllUserSkills() {
    //let usersRef = this.afs.collection('cities');
    return this.afs.collectionGroup(this.skillPath);
  }

  getSkillsof(user) {
    let p = this.userSvc.path + '/' + user + '/' + this.skillPath;
    return this.afs.collection(this.userSvc.path).doc(user).collection(this.skillPath);
  }

  delete(user, sk) {
    return this.afs.collection(this.userSvc.path).doc(user).collection(this.skillPath).doc(sk).delete();
  }

  getSkill(user, sk){
    return this.afs.collection(this.userSvc.path).doc(user).collection(this.skillPath).doc(sk);
  }

}
