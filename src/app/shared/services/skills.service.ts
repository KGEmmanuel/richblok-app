import { Injectable, inject } from '@angular/core';
import {
  Firestore, addDoc, collection, collectionGroup, deleteDoc, doc, updateDoc
} from '@angular/fire/firestore';
import { Skill } from '../entites/Skill';
import { UtilisateurService } from './utilisateur.service';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  readonly skillPath = 'skills';

  private firestore = inject(Firestore);

  constructor(private userSvc: UtilisateurService) {
  }

  private userSkillsCol(userid: string) {
    return collection(this.firestore, this.userSvc.path, userid, this.skillPath);
  }

  adduserSkill(userid: string, sk: Skill) {
    return addDoc(this.userSkillsCol(userid), { ...sk, dateCreation: new Date() });
  }

  updateuserSkill(userid: string, sk: Skill) {
    return updateDoc(
      doc(this.firestore, this.userSvc.path, userid, this.skillPath, sk.id),
      { ...sk }
    );
  }

  getAllUserSkills() {
    return snapshotQuery(collectionGroup(this.firestore, this.skillPath));
  }

  getSkillsof(user: string) {
    return snapshotQuery(this.userSkillsCol(user));
  }

  delete(user: string, sk: string) {
    return deleteDoc(doc(this.firestore, this.userSvc.path, user, this.skillPath, sk));
  }

  /**
   * Returns a modular DocumentReference. Caller should use
   * `getDoc(ref)` (returns Promise<DocumentSnapshot>) instead of the
   * old compat `.get().then(...)` pattern.
   */
  getSkill(user: string, sk: string) {
    return doc(this.firestore, this.userSvc.path, user, this.skillPath, sk);
  }

}
