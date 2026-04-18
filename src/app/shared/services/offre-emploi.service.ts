import { Injectable, inject } from '@angular/core';
import {
  Firestore, addDoc, collection, doc, orderBy, query, updateDoc, where
} from '@angular/fire/firestore';
import { OffresEmploi } from '../entites/OffresEmploi';
import { TagsService } from './tags.service';
import { UtilisateurService } from './utilisateur.service';
import { SkillsService } from './skills.service';
import { Skill } from '../entites/Skill';
import { snapshotDoc, snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {

  readonly path = 'jobsoffer';

  private firestore = inject(Firestore);

  constructor(private tagSvc: TagsService, private userSvc: UtilisateurService, private skilSvc: SkillsService) { }

  private col() {
    return collection(this.firestore, this.path);
  }

  offresListOfOrganisationRef(organisationref: string, statut?: string, typeOffre?: string) {
    const base = this.col();
    let q;
    if (statut) {
      q = query(base, where('ownerOrg', '==', organisationref), where('statut', '==', statut), orderBy('datefin'));
    } else if (statut && typeOffre) {
      q = query(base, where('ownerOrg', '==', organisationref), where('statut', '==', statut), where('jobType', '==', typeOffre), orderBy('datefin'));
    } else {
      console.log('getting ALL');
      q = query(base, where('ownerOrg', '==', organisationref), orderBy('datefin'));
    }
    return snapshotQuery(q);
  }

  offresByTag(tags: string[]) {
    console.log('tags', tags);
    const base = this.col();
    const q = !tags
      ? query(base, where('statut', '==', 'PU'), orderBy('datedeb'))
      : query(base, where('tags', 'array-contains-any', tags), where('statut', '==', 'PU'), orderBy('datedeb'));
    return snapshotQuery(q);
  }

  offresListByUserRef(user: string, statut?: string, typeOffre?: string) {
    const base = this.col();
    let q;
    if (statut) {
      q = query(base, where('ownerUser', '==', user), where('statut', '==', statut), orderBy('datefin'));
    } else if (statut && typeOffre) {
      q = query(base, where('ownerUser', '==', user), where('statut', '==', statut), where('jobType', '==', typeOffre), orderBy('datefin'));
    } else {
      console.log('getting ALL');
      q = query(base, where('ownerUser', '==', user), orderBy('datefin'));
    }
    return snapshotQuery(q);
  }

  save(job: OffresEmploi) {
    const tags = this.tagSvc.buildTags(this.tagsItems(job));
    console.log('tags builded', tags);
    job.tags = tags;
    job.createDate = new Date();
    job.dateCreation = new Date();
    return addDoc(this.col(), Object.assign({}, job));
  }

  update(job: OffresEmploi) {
    const tags = this.tagSvc.buildTags(this.tagsItems(job));
    console.log('tags builded', tags);
    job.tags = tags;
    return updateDoc(doc(this.firestore, this.path, job.id), Object.assign({}, job) as any);
  }

  closeStep(job: OffresEmploi) {
    const nextStep = +job.currentStep + 1;
    return updateDoc(doc(this.firestore, this.path, job.id), { currentStep: nextStep });
  }


  tagsItems(job: OffresEmploi): any[] {
    const t = [];
    t.push(job);
    t.push(job.competencessup.map(v => { return v.skillName }));
    t.push(job.formations.map(v => { return v.domaine + ' ' + v.nomDiplome }));
    return t;
  }

  getDocRef(jobId: string) {
    return snapshotDoc(doc(this.firestore, this.path, jobId));
  }


  jobsRelated(user: string) {
    return this.skilSvc.getSkillsof(user).onSnapshot(v => {
      const t = [];
      v.forEach(k => {
        t.push((k.data() as Skill).skillName);
      });
      const tgs = this.tagSvc.buildTags(t);
      return this.offresByTag(tgs);
    });
  }

}
