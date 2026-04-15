import { Injectable } from '@angular/core';
import { Utilisateur } from '../entites/Utilisateur';
import { DocumentReference, QueryFn, DocumentSnapshot, Query } from '@angular/fire/firestore/interfaces';
import { Observable, from, Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';
import { finalize, map, switchMap, filter } from 'rxjs/operators';
import { Formation } from '../entites/Formation';
import { Experience } from '../entites/Experience';
import * as firebase from 'firebase';
import { Notification } from '../entites/Notification';
import { Post } from '../entites/Post';
import { Participant } from '../entites/Participant';
import { async } from 'q';
import { HttpClient } from '@angular/common/http';
import { Certification } from '../entites/Certification';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Block } from '../entites/block';
import { AngularFirestore } from '@angular/fire/firestore';

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

  formationQuery: Query;
  utilisateursQuery: Query;


  // angular fire
  // formationsCollection: AngularFirestoreCollection<Formation>;


  private afs = firebase.firestore();

  constructor(private storage: AngularFireStorage, private http: HttpClient, private angFs: AngularFirestore) {
    // firebase.auth().languageCode = 'fr';
    this.afs = firebase.firestore();


  }

  add(data: Utilisateur): Promise<DocumentReference> {
    return this.afs.collection(this.path).add({ ...data, dateCreation: new Date() });
  }

  set(data: Utilisateur, id: string): Promise<void> {
   // alert(id);
    return this.afs.collection(this.path).doc(id).set({ ...data, dateCreation: new Date() });
  }

  remove(id: string): Promise<void> {
    return this.afs.doc(`${this.path}/${id}`).delete();
  }

  get(id: string): Observable<Utilisateur> {
    return from(this.afs.collection(this.path).doc(id).get().then<Utilisateur>(val => {
      const u = val.data() as Utilisateur;
      u.id = val.id;
      return u;
    }));
  }

  getByEmail(mail: string) {
    return this.afs.collection(this.path).where('email', '==', mail);
  }


  getDocRef(id: string) {
    return this.afs.collection(this.path).doc(id);
  }



  getRelatedOfOrganisation(orgname) {
    return this.afs.collection(this.path).where('lieu', '==', orgname);
  }

  getArchivedFormationListof(userid: string) {
    const p = this.path + '/' + userid + '/' + this.archFormationPath;
    // alert('path is' + p);
    return this.afs.collection(p).where('next', '==', '');
  }

  getArchivedCompetanceListof(userid: string) {
    return this.afs.collection(this.path).doc(userid).collection(this.archCompetencePath).where('next', '==', '');
  }

  getArchivedExperienceListof(userid: string) {
    return this.afs.collection(this.path).doc(userid).collection(this.archExperiencePath).where('next', '==', '').orderBy('data.datedeb');
  }


  certifieElement(type: string, blocId: string, userId: string, note: string, observation: string, certkey: string) {


    const cert = new Certification();
   // cert.certificateur = this.getcurrentuser();
    /*
    if(!this.getcurrentuser().certifkey)
    {
       // alert('Vous n\'avez pas définit une clé de certification, vous ne pouvez donc pas effectuer cette opération');
       return;
    }*/
    let p: string;
    // alert(type);
    switch (type) {
      case 'FO': p = this.archFormationPath; break;
      case 'CO': p = this.archCompetencePath; break;
      case 'EX': p = this.archExperiencePath; break;
    }
    if (!p) {
      // alert('Impossible de certifier ce type d\'élements...');
      return;
    }
    cert.dateSign = new Date();

    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          // this.geolocationPosition = position,
          // console.log('position ...  ' + position);
          cert.lattitude = position.coords.latitude;
          cert.longitude = position.coords.longitude;
          cert.altitude = position.coords.altitude;
          cert.niveaucote = note;
          cert.observation = observation;
          const pe = this.path + '/' + userId + '/' + p + '/' + blocId + '/certifications';
          // alert(pe);
          this.afs.collection(pe).add({ ...cert, dateCreation: new Date() }).then(val => {
            // alert('Votre certification a été pris en considération. Merci');
          }).catch(err => {
            // alert(err.message);
          });
        },
        error => {
          switch (error.code) {
            case 1:
              // alert('Impossible de certifier' + '  Acces refusé à la localisation');
              // console.log('Permission Denied');
              break;
            case 2:
              // alert('Impossible de certifier' + ' Position indisponible');
              // console.log('Position Unavailable');
              break;
            case 3:
              // alert('Impossible de certifier' + '  Timeout');
              // console.log('Timeout');
              break;
          }
          return;
        }
      );
    }

  }

  getArchivedFormationRef(userid: string) {
    return this.afs.collection(this.path).doc(userid).collection(this.formationpath).where('archived', '==', true);
  }

  getArchivedFormation(userid: string, formationid: string): Observable<Formation> {
    return from(this.afs.collection(this.path).doc(userid).collection(this.formationpath)
      .doc(formationid).get().then<Formation>(val => {
        const u = val.data() as Formation;
        u.id = val.id;
        return u;
      }));
  }

  getArchivedCompetence(userid: string, formationid: string): Observable<Formation> {
    return from(this.afs.collection(this.path).doc(userid).collection(this.archCompetencePath)
      .doc(formationid).get().then<Formation>(val => {
        const u = val.data() as Formation;
        u.id = val.id;
        return u;
      }));
  }


  getArchivedExperience(userid: string, formationid: string): Observable<Formation> {
    return from(this.afs.collection(this.path).doc(userid).collection(this.archExperiencePath)
      .doc(formationid).get().then<Formation>(val => {
        const u = val.data() as Formation;
        u.id = val.id;
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
      // alert('Impossible de certifier ce type d\'élements...');
      return;
    }
    return from(this.afs.collection(this.path).doc(userid).collection(p)
      .doc(formationid).collection('certifications').orderBy('dateSign', 'desc').get().then()).pipe(map(actions => {

        return actions.docs.map(action => {
          const data = action.data() as Certification;
          const id = action.id;

          return { id, ...data };
        }
        );
      }));
  }

  update(id: string, data: Partial<Utilisateur>): Promise<void> {
    // data.id = undefined;
    return this.afs.doc(`${this.path}/${id}`).update(data);
  }

  addFormation(data: Formation): Promise<DocumentReference> {
    const p = this.path + '/' + this.getcurrentuser().id + '/' + this.formationpath;
    return this.afs.collection(this.path).doc(this.getcurrentuser().id).collection(this.formationpath)
      .add({ ...data, dateCreation: new Date() });
  }

  updateFormation(data: Partial<Formation>) {
    const p = this.path + '/' + this.getcurrentuser().id + '/' + this.formationpath;
    return this.afs.collection(this.path).doc(this.getcurrentuser().id).collection(this.formationpath).doc(data.id)
      .update({ ...data });
  }

  getCollection$(ref?: QueryFn): Observable<Utilisateur[]> {

    return from(this.afs.collection(this.path).orderBy('nom', 'asc').get().then()).pipe(map(actions => {

      return actions.docs.map(action => {
        const data = action.data() as Utilisateur;
        const id = action.id;

        return { id, ...data };
      }
      );
    }));

    // return from(this.afs.collection(this.path).get().then<Utilisateur[]>());
  }

  addExperience(user: string, data: Experience): Promise<DocumentReference> {
    const p = this.path + '/' + user + '/' + this.experiencepath;
    return this.afs.collection(this.path).add({ ...data, dateCreation: new Date() });
  }

  editcouverture(file) {
    const user = this.getcurrentuser();
    const filePath = this.couverturepath + '/' + user.id + '.jpg';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(img => {
        user.imagecouv = img;
        this.update(user.id, { imagecouv: img });
        this.setcurrentuser(user);
      }))
    )
      .subscribe();
  }

  editprofile(file) {
    const user = this.getcurrentuser();
    const filePath = this.profilepath + '/' + user.id + '.jpg';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(img => {
        user.imageprofil = img;
        this.update(user.id, { imageprofil: img });
        this.setcurrentuser(user);
      }))
    ).subscribe();
  }

  getcurrentuser(): Utilisateur {
    let user: Utilisateur = null;
    // // alert(localStorage.getItem('currentuser')+' check '+ (localStorage.getItem('currentuser') === 'undefined'));
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
    // alert('url is ' + url);
    // const value;
    return this.http.get(url);
  }

  archiveCompetence(competid: string): Observable<string> {
    const url = this.archiveCompetenceBaseurl + '?user=' + this.getcurrentuser().id + '&id=' + competid;
    // alert('url is ' + url);
    return this.http.get<string>(url);
  }

  archiveExperience(expeid: string): Observable<string> {
    const url = this.archiveExperience + '?user=' + this.getcurrentuser().id + '&id=' + expeid;
    // alert('url is ' + url);
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

    // // alert("user id is  "+ userid);
    const p = this.path + '/' + this.getcurrentuser().id + '/' + this.formationpath;
    return p;
  }

  mightKnowUser(user: Utilisateur): Observable<Utilisateur[]> {

    return this.angFs.collection(this.path)
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Utilisateur;
        const id = a.payload.doc.id;
        return { id, ...data };
      }).filter( (a) => {
        console.log(a.id, user);
        return a.id !== user.id && !user.abonnees.includes(a.id) && !user.demandesabonnees.includes(a.id);
      }))
    );
    // return this.angFs.collection<Utilisateur>(this.path).snapshotChanges();
    // return null;
  }

  askconnection(from: string, to: string ) {
    return this.afs.collection(this.path).doc(to).update({
      demandesabonnees: firebase.firestore.FieldValue.arrayUnion(from)
      });
  }

  saveJob(uid, jobId) {
    return this.afs.collection(this.path).doc(uid).update({
      savedJobs: firebase.firestore.FieldValue.arrayUnion(jobId)
      });
  }

  confirmconnection(of: string, by: string) {
    return this.afs.collection(this.path).doc(by).update({
      demandesabonnees: firebase.firestore.FieldValue.arrayRemove(of)
      }).then(v => {
        return this.afs.collection(this.path).doc(by).update({
          abonnees: firebase.firestore.FieldValue.arrayUnion(of)
          });
      }).catch(er => {
        return null;
      });
  }

  initDatas(user?: string) {

    this.utilisateursQuery = this.afs.collection(this.path).orderBy('nom', 'asc');
    this.items = from(this.afs.collection(this.path).orderBy('nom', 'asc').get().then()).pipe(map(actions => {

      return actions.docs.map(action => {
        const data = action.data() as Utilisateur;
        const id = action.id;

        return { id, ...data };
      }
      );
    }));
    return;
    // // alert('getting items');
    if (!user) {
      user = this.getcurrentuser().id;
    }


    if (!this.getcurrentuser()) {
      return;
    }

    if (!user) {
      return;
    }

    // // alert("user id is  "+ userid);
    const p = this.path + '/' + user + '/' + this.formationpath;
    /*
        this.formationsCollection = this.db.collection<Formation>(p);
        this.formations = this.formationsCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Formation;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );;
    */

    /*
        const size$ = new Subject<string>();
        this.formations = this.db.collection<Formation>(p).valueChanges()
    */
    this.formationQuery = this.afs.collection(p);

    /*
  this.afs.collection(p).orderBy('datedeb', 'desc').onSnapshot(val=>{
   // this.formationsArray =

    val.forEach(form=>{
      const data = form.data() as Formation;
        const id = form.id;
        // alert("reding formations  " + id + ' path ' + p);
        this.formationsArray.push( {id, ...data })
    })

  });*/




    this.formations = from(this.afs.collection(p).orderBy('datedeb', 'desc').get().then()).pipe(map(actions => {

      return actions.docs.map(action => {
        const data = action.data() as Formation;
        const id = action.id;
        // alert('reding formations  ' + id + ' path  ' + p);
        return { id, ...data };
      }
      );
    }));

    const e = this.path + '/' + this.getcurrentuser().id + '/' + this.experiencepath;
    this.experiences = from(this.afs.collection(e).orderBy('datedeb', 'desc').get()).pipe(map(actions => {

      return actions.docs.map(action => {
        const data = action.data() as Experience;
        const id = action.id;
        // // alert("user id is  "+id);
        return { id, ...data };
      }
      );
    }));


    this.relatedNotifs = from(this.afs.collection(this.notificationpath)
      .where('abonnees', 'array-contains', this.getcurrentuser().id)
      .orderBy('date', 'desc').get()).pipe(map(actions => {

        return actions.docs.map(action => {
          const data = action.data() as Notification;
          const id = action.id;
          // // alert("user id is  "+id);
          return { id, ...data };
        }
        );
      }));
    this.relatedPost = from(this.afs.collection(this.postpath).where('abonnees', 'array-contains', this.getcurrentuser().id)
      .orderBy('date', 'desc').get()).pipe(map(actions => {

        return actions.docs.map(action => {
          const data = action.data() as Post;
          const id = action.id;
          // // alert("user id is  "+id);
          return { id, ...data };
        }
        );
      }));
    this.ownedPost = from(this.afs.collection(this.postpath).where('owner', '==', this.getcurrentuser().id)
      .orderBy('date', 'desc').get().then()).pipe(map(actions => {

        return actions.docs.map(action => {
          const data = action.data() as Post;
          const id = action.id;
          // // alert("user id is  "+id);
          return { id, ...data };
        }
        );
      }));

  }

}
