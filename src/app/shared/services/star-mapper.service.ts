import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap, first } from 'rxjs/operators';
import { StarAnswer, StarProfile, COMPETENCY_LABELS, COMPETENCY_QUESTIONS } from '../entites/StarProfile';
import { CompetencyTag, Challenge } from '../entites/Challenge';
import * as firebase from 'firebase/app';

export interface StarMapInput {
  uid: string;
  challengeId: string;
  challengeTitle: string;
  challengeFormat?: string;
  skills?: string[];
  competencyTags?: CompetencyTag[];
  score?: number;
  correct?: number;
  total?: number;
  badgeId?: string;
  project?: string;
}

/**
 * Generates STAR behavioral-interview answers from a completed challenge
 * and stores them as a StarProfile in Firestore. Used by the challenge
 * submit flow (US-02 from PRD v3) and viewable via the AI Interview Coach.
 */
@Injectable({
  providedIn: 'root'
})
export class StarMapperService {

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore
  ) {}

  /**
   * Call the server's Claude proxy to generate STAR answers, then persist.
   */
  generateAndSave(input: StarMapInput): Observable<StarProfile> {
    const tags = (input.competencyTags && input.competencyTags.length)
      ? input.competencyTags
      : ['pressure_performance', 'decision_making', 'learning_from_failure'] as CompetencyTag[];

    const body = {
      challengeTitle: input.challengeTitle,
      challengeFormat: input.challengeFormat,
      skills: input.skills || [],
      competencyTags: tags,
      score: input.score || 0,
      correct: input.correct || 0,
      total: input.total || 20,
      project: input.project || ''
    };

    return this.http.post<{ answers: StarAnswer[]; unlockedQuestions: string[]; mode: string }>(
      '/api/star-map',
      body
    ).pipe(
      catchError(err => {
        // eslint-disable-next-line no-console
        console.warn('StarMapper API error, falling back to templates', err);
        return of({
          answers: this.templatedFallback(tags, input),
          unlockedQuestions: tags.map(t => (COMPETENCY_QUESTIONS[t] || [])[0]).filter(Boolean),
          mode: 'client_fallback'
        });
      }),
      switchMap(result => {
        const profile: StarProfile = {
          uid: input.uid,
          challengeId: input.challengeId,
          challengeTitle: input.challengeTitle,
          badgeId: input.badgeId,
          score: input.score,
          answers: result.answers,
          unlockedQuestions: result.unlockedQuestions,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        return from(this.afs.collection('star_profiles').add(profile as any)).pipe(
          map(ref => ({ ...profile, id: ref.id }))
        );
      })
    );
  }

  /**
   * Fetch a saved STAR Profile by id.
   */
  get(id: string): Observable<StarProfile | null> {
    return this.afs.doc<StarProfile>(`star_profiles/${id}`).valueChanges().pipe(
      first(),
      map(d => d ? ({ ...d, id } as StarProfile) : null)
    );
  }

  /**
   * List all StarProfiles owned by a user.
   */
  listForUser(uid: string): Observable<StarProfile[]> {
    return this.afs.collection<StarProfile>('star_profiles', ref =>
      ref.where('uid', '==', uid).orderBy('createdAt', 'desc').limit(50)
    ).snapshotChanges().pipe(
      map(snaps => snaps.map(s => ({ ...(s.payload.doc.data() as StarProfile), id: s.payload.doc.id })))
    );
  }

  /**
   * Update a single answer (user edited).
   */
  updateAnswer(profileId: string, updatedAnswers: StarAnswer[]): Observable<void> {
    return from(this.afs.doc(`star_profiles/${profileId}`).update({
      answers: updatedAnswers,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }));
  }

  private templatedFallback(tags: CompetencyTag[], input: StarMapInput): StarAnswer[] {
    return tags.slice(0, 5).map(tag => {
      const label = COMPETENCY_LABELS[tag] || tag;
      const question = (COMPETENCY_QUESTIONS[tag] || ['Tell me about a challenge you solved.'])[0];
      return {
        competency: tag,
        competencyLabel: label,
        question,
        situation: `I completed the Richblok "${input.challengeTitle}" — a timed assessment covering ${(input.skills || []).join(', ')}.`,
        task: `Demonstrate ${label.toLowerCase()} by answering ${input.total || 20} questions under time pressure.`,
        action: `I prioritized confident answers first to secure wins, then systematically worked through ambiguous questions by eliminating implausible options.`,
        result: `I scored ${input.score || 0}/100 (${input.correct || 0}/${input.total || 20}), earning a verified Richblok badge — a concrete proof point I can cite in interviews.`
      };
    });
  }
}
