import { Injectable } from '@angular/core';
import { Langue } from '../entites/Langue';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly path = 'langues';
  readonly basePaht = 'utilisateurs';
  db = firebase.firestore();
  LanguagesLevels = new Map();

  constructor() {
    this.LanguagesLevels.set('A0', 'Beginner');
    this.LanguagesLevels.set('A1', 'Elementary');
    this.LanguagesLevels.set('A2', 'Pre-intermediate');
    this.LanguagesLevels.set('B1', 'Intermediate');
    this.LanguagesLevels.set('B2', 'Upper-intermediate');
    this.LanguagesLevels.set('C1', 'Advanced');
    this.LanguagesLevels.set('C2', 'Proficient'); 
  }

  addLanguage(user: string, data: Langue) {
   // const tags = 
    return this.db.collection(this.basePaht).doc(user).collection(this.path).add(Object.assign({}, data));
  }

  updateLanguage(user: string,id, data: Langue) {
    // const tags = 
     return this.db.collection(this.basePaht).doc(user).collection(this.path).doc(id).update(Object.assign({}, data));
   }

  deletelanguage(user: string, lang: string) {
    return this.db.collection(this.basePaht).doc(user).collection(this.path).doc(lang).delete();
  }

  listLanguages(user: string) {
    return this.db.collection(this.basePaht).doc(user).collection(this.path);
  }

}
