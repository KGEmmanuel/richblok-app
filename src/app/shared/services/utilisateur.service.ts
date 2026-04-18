import { Injectable, inject } from '@angular/core';
import { Utilisateur } from '../entites/Utilisateur';
import {
  Firestore, DocumentReference, addDoc, arrayRemove, arrayUnion, collection,
  collectionData, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc,
  updateDoc, where
} from '@angular/fire/firestore';
import { Storage, ref as storageRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Formation } from '../entites/Formation';
import { Experience } from '../entites/Experience';
import { Notification } from '../entites/Notification';
import { Post } from '../entites/Post';
import { Participant } from '../entites/Participant';
import { HttpClient } from '@angular/common/http';
import { Certification } from '../entites/Certification';
import { snapshotDoc, snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  readonly path = 'utilisateurs';
  readonly archFormationPath = 'arch_formations';
  readonly archCompetencePath = 'arch_competences';
  readonly archExperiencePath = 'arch_experience';
  readonly couverturepath = 'cover';
  readonly profilepath = 'profiles';
  readonly formationpath = 'formations';
  readonly experiencepath = 'experiences';
  readonly notificationpath = 'notifications';
  readonly competencePath = 'competences';
  readonly postpath = 'posts';
  readonly participationpath = 'participants';
  readonly archiveFormationBaseurl = 'https://us-central1-richblok-app.cloudfunctions.net/archveFormation';
  readonly archiveCompetenceBaseurl = 'https://us-central1-richblok-app.cloudfunctions.net/archveCompetence';
  readonly archiveExperienceBaseurl = 'https://us-central1-richblok-app.cloudfunctions.net/archveExperience';
  items: Observable<Utilisateur[]>;
  formations: Observable<Formation[]>;
  formationsArray: Formation[];
  experiences: Observable<Experience[]>;
  relatedNotifs: Observable<Notification[]>;
  relatedPost: Observable<Post[]>;
  ownedPost: Observable<Post[]>;
  projetsParti: Observable<Participant[]>;
  tachehorsProjetParti: Observable<Participant[]>;

  private firestore = inject(Firestore);
  private storage = inject(Storage);

  constructor(private http: HttpClient) {
  }

  private col() {
    return collection(this.firestore, this.path);
  }

  private userDoc(id: string) {
    return doc(this.firestore, this.path, id);
  }

  add(data: Utilisateur): Promise<DocumentReference> {
    return addDoc(this.col(), { ...data, dateCreation: new Date() });
  }

  set(data: Utilisateur, id: string): Promise<void> {
    return setDoc(this.userDoc(id), { ...data, dateCreation: new Date() });
  }

  remove(id: string): Promise<void> {
    return deleteDoc(this.userDoc(id));
  }

  get(id: string): Observable<Utilisateur> {
    return from(getDoc(this.userDoc(id)).then<Utilisateur>(val => {
      const u = val.data() as Utilisateur;
      if (u) { u.id = val.id; }
      return u;
    }));
  }

  getByEmail(mail: string) {
    return snapshotQuery(query(this.col(), where('email', '==', mail)));
  }


  getDocRef(id: string) {
    return snapshotDoc(this.userDoc(id));
  }



  getRelatedOfOrganisation(orgname: string) {
    return snapshotQuery(query(this.col(), where('lieu', '==', orgname)));
  }

  getArchivedFormationListof(userid: string) {
    return snapshotQuery(
      query(collection(this.firestore, this.path, userid, this.archFormationPath), where('next', '==', ''))
    );
  }

  getArchivedCompetanceListof(userid: string) {
    return snapshotQuery(
      query(collection(this.firestore, this.path, userid, this.archCompetencePath), where('next', '==', ''))
    );
  }

  getArchivedExperienceListof(userid: string) {
    return snapshotQuery(
      query(
        collection(this.firestore, this.path, userid, this.archExperiencePath),
        where('next', '==', ''),
        orderBy('data.datedeb')
      )
    );
  }


  certifieElement(type: string, blocId: string, userId: string, note: string, observation: string, certkey: string) {
    const cert = new Certification();
    let p: string;
    switch (type) {
      case 'FO': p = this.archFormationPath; break;
      case 'CO': p = this.archCompetencePath; break;
      case 'EX': p = this.archExperiencePath; break;
    }
    if (!p) {
      return;
    }
    cert.dateSign = new Date();

    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          cert.lattitude = position.coords.latitude;
          cert.longitude = position.coords.longitude;
          cert.altitude = position.coords.altitude;
          cert.niveaucote = note;
          cert.observation = observation;
          addDoc(
            collection(this.firestore, this.path, userId, p, blocId, 'certifications'),
            { ...cert, dateCreation: new Date() }
          ).then(() => { /* noop */ }).catch(() => { /* noop */ });
        },
        error => {
          switch (error.code) {
            case 1: break; // permission denied
            case 2: break; // position unavailable
            case 3: break; // timeout
          }
          return;
        }
      );
    }

  }

  getArchivedFormationRef(userid: string) {
    return snapshotQuery(
      query(collection(this.firestore, this.path, userid, this.formationpath), where('archived', '==', true))
    );
  }

  getArchivedFormation(userid: string, formationid: string): Observable<Formation> {
    return from(getDoc(doc(this.firestore, this.path, userid, this.formationpath, formationid)).then<Formation>(val => {
      const u = val.data() as Formation;
      if (u) { u.id = val.id; }
      return u;
    }));
  }

  getArchivedCompetence(userid: string, formationid: string): Observable<Formation> {
    return from(getDoc(doc(this.firestore, this.path, userid, this.archCompetencePath, formationid)).then<Formation>(val => {
      const u = val.data() as Formation;
      if (u) { u.id = val.id; }
      return u;
    }));
  }


  getArchivedExperience(userid: string, formationid: string): Observable<Formation> {
    return from(getDoc(doc(this.firestore, this.path, userid, this.archExperiencePath, formationid)).then<Formation>(val => {
      const u = val.data() as Formation;
      if (u) { u.id = val.id; }
      return u;
    }));
  }


  getCertificateurs(userid: string, formationid: string, type: string): Observable<Certification[]> {
    let p: string;
    switch (type) {
      case 'FO': p = this.archFormationPath; break;
      case 'CO': p = this.archCompetencePath; break;
      case 'EX': p = this.archExperiencePath; break;
    }
    if (!p) {
      return;
    }
    return from(
      getDocs(
        query(
          collection(this.firestore, this.path, userid, p, formationid, 'certifications'),
          orderBy('dateSign', 'desc')
        )
      )
    ).pipe(map(actions => actions.docs.map(action => {
      const data = action.data() as Certification;
      const id = action.id;
      return { id, ...data };
    })));
  }

  update(id: string, data: Partial<Utilisateur>): Promise<void> {
    return updateDoc(this.userDoc(id), data as any);
  }

  addFormation(data: Formation): Promise<DocumentReference> {
    const uid = this.getcurrentuser().id;
    return addDoc(
      collection(this.firestore, this.path, uid, this.formationpath),
      { ...data, dateCreation: new Date() }
    );
  }

  updateFormation(data: Partial<Formation>) {
    const uid = this.getcurrentuser().id;
    return updateDoc(
      doc(this.firestore, this.path, uid, this.formationpath, data.id),
      { ...data }
    );
  }

  getCollection$(): Observable<Utilisateur[]> {
    return from(getDocs(query(this.col(), orderBy('nom', 'asc')))).pipe(
      map(actions => actions.docs.map(action => {
        const data = action.data() as Utilisateur;
        const id = action.id;
        return { id, ...data };
      }))
    );
  }

  addExperience(user: string, data: Experience): Promise<DocumentReference> {
    return addDoc(this.col(), { ...data, dateCreation: new Date() });
  }

  editcouverture(file: File) {
    const user = this.getcurrentuser();
    const filePath = this.couverturepath + '/' + user.id + '.jpg';
    const fileRef = storageRef(this.storage, filePath);
    uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef)).then(img => {
      user.imagecouv = img;
      this.update(user.id, { imagecouv: img });
      this.setcurrentuser(user);
    });
  }

  editprofile(file: File) {
    const user = this.getcurrentuser();
    const filePath = this.profilepath + '/' + user.id + '.jpg';
    const fileRef = storageRef(this.storage, filePath);
    uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef)).then(img => {
      user.imageprofil = img;
      this.update(user.id, { imageprofil: img });
      this.setcurrentuser(user);
    });
  }

  getcurrentuser(): Utilisateur {
    let user: Utilisateur = null;
    if (localStorage.getItem('currentuser') !== null) {
      if (localStorage.getItem('currentuser') !== 'undefined') {
        user = JSON.parse(localStorage.getItem('currentuser'));
      }
    }
    return user;
  }

  setcurrentuser(u: Utilisateur) {
    localStorage.setItem('currentuser', JSON.stringify(u));
  }

  archiveFormation(formationid: string) {
    const url = this.archiveFormationBaseurl + '?user=' + this.getcurrentuser().id + '&id=' + formationid;
    return this.http.get(url);
  }

  archiveCompetence(competid: string): Observable<string> {
    const url = this.archiveCompetenceBaseurl + '?user=' + this.getcurrentuser().id + '&id=' + competid;
    return this.http.get<string>(url);
  }

  archiveExperience(expeid: string): Observable<string> {
    const url = this.archiveExperience + '?user=' + this.getcurrentuser().id + '&id=' + expeid;
    return this.http.get<string>(url);
  }


  geteditableformationpath(): string {

    if (!this.getcurrentuser()) {
      return null;
    }
    const userid = this.getcurrentuser().id;
    if (!userid) {
      return null;
    }
    const p = this.path + '/' + this.getcurrentuser().id + '/' + this.formationpath;
    return p;
  }

  mightKnowUser(user: Utilisateur): Observable<Utilisateur[]> {
    return collectionData(this.col(), { idField: 'id' }).pipe(
      map(arr => (arr as unknown as Utilisateur[]).filter(a => {
        console.log(a.id, user);
        return a.id !== user.id
          && !user.abonnees.includes(a.id)
          && !user.demandesabonnees.includes(a.id);
      }))
    );
  }

  askconnection(from: string, to: string) {
    return updateDoc(this.userDoc(to), {
      demandesabonnees: arrayUnion(from)
    });
  }

  saveJob(uid: string, jobId: string) {
    return updateDoc(this.userDoc(uid), {
      savedJobs: arrayUnion(jobId)
    });
  }

  confirmconnection(of: string, by: string) {
    return updateDoc(this.userDoc(by), {
      demandesabonnees: arrayRemove(of)
    }).then(() => {
      return updateDoc(this.userDoc(by), {
        abonnees: arrayUnion(of)
      });
    }).catch(() => {
      return null;
    });
  }

  initDatas(user?: string) {
    this.items = from(getDocs(query(this.col(), orderBy('nom', 'asc')))).pipe(
      map(actions => actions.docs.map(action => {
        const data = action.data() as Utilisateur;
        const id = action.id;
        return { id, ...data };
      }))
    );
  }

}
