import { Component, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore, addDoc, collection, doc, getDocs, limit, query, serverTimestamp,
  setDoc, where
} from '@angular/fire/firestore';
import { CHALLENGES_SEED } from '../shared/data/challenges-seed';
import { first } from 'rxjs/operators';

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

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async runSeed() {
    if (this.running) { return; }
    this.running = true;
    this.statuses = CHALLENGES_SEED.map(c => ({
      slug: c.slug, title: c.titre, status: 'pending' as const
    }));

    const user = await authState(this.auth).pipe(first()).toPromise();
    if (!user) {
      this.statuses.forEach(s => { s.status = 'error'; s.message = 'Sign in first'; });
      this.running = false;
      return;
    }

    const challengesCol = collection(this.firestore, 'challenges');

    for (let i = 0; i < CHALLENGES_SEED.length; i++) {
      const c = CHALLENGES_SEED[i];
      const st = this.statuses[i];
      st.status = 'creating';
      try {
        // Upsert by slug: if a challenge with this slug already exists, overwrite it.
        const existing = await getDocs(
          query(challengesCol, where('slug', '==', c.slug), limit(1))
        );

        const payload: any = {
          ...c,
          creatorRef: user.uid,
          dateCreation: new Date(),
          dateDeb: serverTimestamp(),
          dateFin: null
        };

        if (existing && !existing.empty) {
          const docId = existing.docs[0].id;
          await setDoc(doc(this.firestore, 'challenges', docId), payload, { merge: true });
          st.id = docId;
          st.message = 'Updated existing';
        } else {
          const ref = await addDoc(challengesCol, payload);
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
