import { Injectable, inject } from '@angular/core';
import { Langue } from '../entites/Langue';
import {
  Firestore, addDoc, collection, deleteDoc, doc, updateDoc
} from '@angular/fire/firestore';
import { snapshotQuery } from './firestore-compat-shim';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly path = 'langues';
  readonly basePaht = 'utilisateurs';
  LanguagesLevels = new Map();

  private firestore = inject(Firestore);

  constructor() {
    this.LanguagesLevels.set('A0', 'Beginner');
    this.LanguagesLevels.set('A1', 'Elementary');
    this.LanguagesLevels.set('A2', 'Pre-intermediate');
    this.LanguagesLevels.set('B1', 'Intermediate');
    this.LanguagesLevels.set('B2', 'Upper-intermediate');
    this.LanguagesLevels.set('C1', 'Advanced');
    this.LanguagesLevels.set('C2', 'Proficient');
  }

  private col(user: string) {
    return collection(this.firestore, this.basePaht, user, this.path);
  }

  addLanguage(user: string, data: Langue) {
    return addDoc(this.col(user), Object.assign({}, data));
  }

  updateLanguage(user: string, id: string, data: Langue) {
    return updateDoc(
      doc(this.firestore, this.basePaht, user, this.path, id),
      Object.assign({}, data) as any
    );
  }

  deletelanguage(user: string, lang: string) {
    return deleteDoc(doc(this.firestore, this.basePaht, user, this.path, lang));
  }

  listLanguages(user: string) {
    return snapshotQuery(this.col(user));
  }

}
