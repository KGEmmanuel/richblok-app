import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { OffresEmploi } from '../entites/OffresEmploi';
import { TagsService } from './tags.service';
import { UtilisateurService } from './utilisateur.service';
import { SkillsService } from './skills.service';
import { Skill } from '../entites/Skill';

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {

  readonly path = 'jobsoffer';

  db = firebase.firestore();

  constructor(private tagSvc: TagsService, private userSvc: UtilisateurService, private skilSvc: SkillsService) { }
  //ownerUser: string;
  //ownerOrg: string; // org, user
  offresListOfOrganisationRef(organisationref: string, statut?: string, typeOffre?: string) {
    if (statut) {
      return this.db.collection(this.path).where('ownerOrg', '==', organisationref)
        .where('statut', '==', statut)
        .orderBy('datefin');
    }
    if (statut && typeOffre) {
      return this.db.collection(this.path).where('ownerOrg', '==', organisationref)
        .where('statut', '==', statut)
        .where('jobType', '==', typeOffre)
        .orderBy('datefin');
    }
    console.log('getting ALL');
    return this.db.collection(this.path).where('ownerOrg', '==', organisationref)
      .orderBy('datefin');
  }

  //alloffres()


  offresByTag(tags: string[]) {
    console.log('tags', tags);
    if (!tags) {
      return this.db.collection(this.path).where('statut', '==', 'PU').orderBy('datedeb');
    }
    return this.db.collection(this.path).where('tags', "array-contains-any", tags).where('statut', '==', 'PU').orderBy('datedeb');
  }

  offresListByUserRef(user: string, statut?: string, typeOffre?: string) {
    if (statut) {
      return this.db.collection(this.path).where('ownerUser', '==', user)
        .where('statut', '==', statut)
        .orderBy('datefin');
    }
    if (statut && typeOffre) {
      return this.db.collection(this.path).where('ownerUser', '==', user)
        .where('statut', '==', statut)
        .where('jobType', '==', typeOffre)
        .orderBy('datefin');
    }
    console.log('getting ALL');
    return this.db.collection(this.path).where('ownerUser', '==', user)
      .orderBy('datefin');
  }

  save(job: OffresEmploi) {
    const tags = this.tagSvc.buildTags(this.tagsItems(job));
    console.log('tags builded', tags);
    job.tags = tags;
    job.createDate = new Date();
    job.dateCreation = new Date();
    return this.db.collection(this.path).add(Object.assign({}, job));

  }

  update(job: OffresEmploi) {
    const tags = this.tagSvc.buildTags(this.tagsItems(job));
    console.log('tags builded', tags);
    job.tags = tags;
    return this.db.collection(this.path).doc(job.id).update(Object.assign({}, job));
  }

  closeStep(job: OffresEmploi){
    const nextStep = +job.currentStep+1;
    return this.db.collection(this.path).doc(job.id).update({currentStep:nextStep});
  }


  tagsItems(job: OffresEmploi): any[] {
    const t = [];
    t.push(job);
    t.push(job.competencessup.map(v => { return v.skillName }));
    t.push(job.formations.map(v => { return v.domaine + ' ' + v.nomDiplome }));
    return t;
  }

  getDocRef(jobId: string) {
    return this.db.collection(this.path).doc(jobId);
  }


  jobsRelated(user: string) {
    return this.skilSvc.getSkillsof(user).onSnapshot(v => {
      const t = [];
      v.forEach(k => {
        t.push((k.data() as Skill).skillName);
      })
      const tgs = this.tagSvc.buildTags(t);
      return this.offresByTag(tgs);
    })
  }

  /*
    update(userid: string, fid: string, itm: Partial<Formation>) {
      return this.db.collection(this.basePaht + '/' + userid + '/' + this.path).doc(fid).update(itm);
    }*/

}
