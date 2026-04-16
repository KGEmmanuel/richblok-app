import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CHALLENGES_SEED } from '../shared/data/challenges-seed';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

interface SeedStatus {
  slug: string;
  title: string;
  status: 'pending' | 'creating' | 'done' | 'error';
  id?: string;
  message?: string;
}

@Component({
  selector: 'app-admin-seed',
  templateUrl: './admin-seed.component.html',
  styleUrls: ['./admin-seed.component.scss']
})
export class AdminSeedComponent {

  running = false;
  statuses: SeedStatus[] = [];

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  async runSeed() {
    if (this.running) { return; }
    this.running = true;
    this.statuses = CHALLENGES_SEED.map(c => ({
      slug: c.slug, title: c.titre, status: 'pending' as const
    }));

    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (!user) {
      this.statuses.forEach(s => { s.status = 'error'; s.message = 'Sign in first'; });
      this.running = false;
      return;
    }

    for (let i = 0; i < CHALLENGES_SEED.length; i++) {
      const c = CHALLENGES_SEED[i];
      const st = this.statuses[i];
      st.status = 'creating';
      try {
        // Upsert by slug: if a challenge with this slug already exists, overwrite it.
        const existing = await this.afs.collection('challenges', ref =>
          ref.where('slug', '==', c.slug).limit(1)
        ).get().pipe(first()).toPromise();

        const payload: any = {
          ...c,
          creatorRef: user.uid,
          dateCreation: new Date(),
          dateDeb: firebase.firestore.FieldValue.serverTimestamp(),
          dateFin: null
        };

        if (existing && !existing.empty) {
          const docId = existing.docs[0].id;
          await this.afs.collection('challenges').doc(docId).set(payload, { merge: true });
          st.id = docId;
          st.message = 'Updated existing';
        } else {
          const ref = await this.afs.collection('challenges').add(payload);
          st.id = ref.id;
          st.message = 'Created new';
        }
        st.status = 'done';
      } catch (err) {
        st.status = 'error';
        st.message = (err && (err as any).message) || 'Unknown error';
        // eslint-disable-next-line no-console
        console.error('Seed error for', c.slug, err);
      }
    }

    this.running = false;
  }

  get totalQuestions(): number {
    return CHALLENGES_SEED.reduce((acc, c) => acc + c.questions.length, 0);
  }
}
