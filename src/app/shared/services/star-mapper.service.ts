import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap, first } from 'rxjs/operators';
import { StarAnswer, StarProfile, COMPETENCY_LABELS, COMPETENCY_QUESTIONS } from '../entites/StarProfile';
import { CompetencyTag } from '../entites/Challenge';

// D7 Day 1 — modular Firebase migration.
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  query as fsQuery,
  where,
  orderBy,
  limit,
  serverTimestamp
} from '@angular/fire/firestore';

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

/** Structured CV payload returned from /api/cv-extract */
export interface CvData {
  profile?: { fullName?: string; headline?: string; location?: string; email?: string };
  experiences?: Array<any>;
  projects?: Array<any>;
  education?: Array<any>;
  skills?: string[];
}

export interface CvToStarInput {
  uid: string;
  cvData: CvData;
  userName?: string;
  targetCompetencies?: CompetencyTag[];
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

  private firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

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
        console.warn('StarMapper API error, falling back to templates', err);
        return of({
          answers: this.templatedFallback(tags, input),
          unlockedQuestions: tags.map(t => (COMPETENCY_QUESTIONS[t] || [])[0]).filter(Boolean),
          mode: 'client_fallback'
        });
      }),
      switchMap(result => {
        const markedAnswers = (result.answers || []).map(a => ({
          ...a,
          source: 'challenge' as const,
          verified: true,
          verifiedByBadgeId: input.badgeId,
          verifiedAt: serverTimestamp()
        }));
        const profile: StarProfile = {
          uid: input.uid,
          source: 'challenge',
          challengeId: input.challengeId,
          challengeTitle: input.challengeTitle,
          badgeId: input.badgeId,
          score: input.score,
          answers: markedAnswers,
          unlockedQuestions: result.unlockedQuestions,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        return from(addDoc(collection(this.firestore, 'star_profiles'), profile as any)).pipe(
          map(ref => ({ ...profile, id: ref.id }))
        );
      })
    );
  }

  generateFromCv(input: CvToStarInput): Observable<StarProfile> {
    const body = {
      cvData: input.cvData,
      userName: input.userName || (input.cvData.profile && input.cvData.profile.fullName) || '',
      targetCompetencies: input.targetCompetencies || []
    };

    return this.http.post<{ answers: StarAnswer[]; mode: string }>(
      '/api/cv-to-star',
      body
    ).pipe(
      catchError(err => {
        console.warn('CV-to-STAR API error, returning empty set', err);
        return of({ answers: [], mode: 'client_fallback' });
      }),
      switchMap(result => {
        const markedAnswers = (result.answers || []).map(a => ({
          ...a,
          source: 'cv' as const,
          verified: false
        }));
        const unlockedQuestions = markedAnswers.map(a => a.question).filter(Boolean);

        const profile: StarProfile = {
          uid: input.uid,
          source: 'cv',
          cvProfileName: (input.cvData.profile && input.cvData.profile.fullName) || '',
          cvExperienceCount: (input.cvData.experiences || []).length,
          cvProjectCount: (input.cvData.projects || []).length,
          answers: markedAnswers,
          unlockedQuestions,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        return from(addDoc(collection(this.firestore, 'star_profiles'), profile as any)).pipe(
          map(ref => ({ ...profile, id: ref.id }))
        );
      })
    );
  }

  /**
   * Mark answers for a given competency as verified when a matching
   * challenge has been passed.
   */
  verifyCompetencies(profileId: string, competencies: CompetencyTag[], badgeId: string): Observable<void> {
    const ref = doc(this.firestore, 'star_profiles', profileId);
    return (docData(ref) as Observable<StarProfile | undefined>).pipe(
      first(),
      switchMap(p => {
        if (!p) { return of<void>(undefined); }
        const updated = (p.answers || []).map(a => {
          if (competencies.indexOf(a.competency) >= 0 && !a.verified) {
            return { ...a, verified: true, verifiedByBadgeId: badgeId, verifiedAt: new Date() };
          }
          return a;
        });
        return from(updateDoc(ref, { answers: updated, updatedAt: serverTimestamp() } as any));
      })
    );
  }

  get(id: string): Observable<StarProfile | null> {
    const ref = doc(this.firestore, 'star_profiles', id);
    return (docData(ref) as Observable<StarProfile | undefined>).pipe(
      first(),
      map(d => d ? ({ ...d, id } as StarProfile) : null)
    );
  }

  listForUser(uid: string): Observable<StarProfile[]> {
    const q = fsQuery(
      collection(this.firestore, 'star_profiles'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    return (collectionData(q, { idField: 'id' }) as Observable<StarProfile[]>);
  }

  updateAnswer(profileId: string, updatedAnswers: StarAnswer[]): Observable<void> {
    const ref = doc(this.firestore, 'star_profiles', profileId);
    return from(updateDoc(ref, { answers: updatedAnswers, updatedAt: serverTimestamp() } as any));
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
