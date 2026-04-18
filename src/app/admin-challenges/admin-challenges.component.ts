import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { CompetencyTag } from '../shared/entites/Challenge';
import { COMPETENCY_LABELS } from '../shared/entites/StarProfile';

interface AdminChallenge {
  id?: string;
  titre: string;
  slug: string;
  description: string;
  skills: string[];
  competencyTags: CompetencyTag[];
  challengeFormat: string;
  estimatedDuration: string;
  language: string;
  type: string;
  creatorType: string;
  sponsored?: boolean;
}

@Component({
  selector: 'app-admin-challenges',
  templateUrl: './admin-challenges.component.html',
  styleUrls: ['./admin-challenges.component.scss']
})
export class AdminChallengesComponent implements OnInit {

  loading = true;
  saving = false;
  isAdmin: boolean | null = null;

  challenges: AdminChallenge[] = [];
  editing: AdminChallenge | null = null;
  skillsInput = '';

  readonly competencyOptions: Array<{ tag: CompetencyTag; label: string }> = [
    { tag: 'leadership', label: 'Leadership' },
    { tag: 'conflict_resolution', label: 'Conflict Resolution' },
    { tag: 'pressure_performance', label: 'Pressure Performance' },
    { tag: 'learning_from_failure', label: 'Learning from Failure' },
    { tag: 'teamwork', label: 'Teamwork' },
    { tag: 'communication', label: 'Communication' },
    { tag: 'initiative', label: 'Initiative' },
    { tag: 'decision_making', label: 'Decision Making' },
    { tag: 'adaptability', label: 'Adaptability' },
    { tag: 'feedback_reception', label: 'Feedback Reception' }
  ];

  readonly formatOptions = [
    'solo_capstone', 'team', 'hackathon', 'pivot', 'review', 'oss'
  ];

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    authState(this.auth).pipe(first()).subscribe(async user => {
      if (!user) {
        this.isAdmin = false;
        this.loading = false;
        return;
      }
      const userSnap = await getDoc(doc(this.firestore, 'utilisateurs', user.uid));
      const u: any = userSnap.exists() ? userSnap.data() : null;
      this.isAdmin = u && u.role === 'admin';
      this.loadChallenges();
    });
  }

  private async loadChallenges() {
    const snap = await getDocs(collection(this.firestore, 'challenges'));
    this.challenges = snap.docs.map(d => {
      const data = d.data() as AdminChallenge;
      data.id = d.id;
      return data;
    }).sort((a, b) => (a.titre || '').localeCompare(b.titre || ''));
    this.loading = false;
  }

  newChallenge() {
    this.editing = {
      titre: '',
      slug: '',
      description: '',
      skills: [],
      competencyTags: [],
      challengeFormat: 'solo_capstone',
      estimatedDuration: '20 minutes',
      language: 'EN',
      type: 'SKILL',
      creatorType: 'SYS'
    };
    this.skillsInput = '';
  }

  edit(c: AdminChallenge) {
    this.editing = { ...c, skills: [...(c.skills || [])], competencyTags: [...(c.competencyTags || [])] };
    this.skillsInput = (c.skills || []).join(', ');
  }

  cancel() {
    this.editing = null;
  }

  toggleTag(tag: CompetencyTag) {
    if (!this.editing) { return; }
    const set = new Set(this.editing.competencyTags);
    if (set.has(tag)) { set.delete(tag); } else { set.add(tag); }
    this.editing.competencyTags = Array.from(set);
  }

  hasTag(tag: CompetencyTag): boolean {
    return !!this.editing && this.editing.competencyTags.indexOf(tag) >= 0;
  }

  async save() {
    if (!this.editing) { return; }
    if (!this.editing.titre || !this.editing.slug) {
      this.toastr.error('Title and slug required');
      return;
    }
    this.editing.skills = (this.skillsInput || '')
      .split(',').map(s => s.trim()).filter(Boolean);
    this.saving = true;
    try {
      const user = await authState(this.auth).pipe(first()).toPromise();
      const token = user ? await user.getIdToken() : '';
      const resp: any = await this.http.post('/api/admin/challenges',
        this.editing,
        { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }
      ).toPromise();
      this.toastr.success('Challenge saved');
      this.editing = null;
      // Locally refresh
      const existing = this.challenges.find(c => c.id === resp.id);
      if (existing) { Object.assign(existing, resp); }
      else { this.challenges.unshift(resp); }
    } catch (err) {
      const e: any = err;
      this.toastr.error((e && e.error && e.error.error) || (e && e.message) || 'Save failed');
    } finally {
      this.saving = false;
    }
  }

  async deleteChallenge(c: AdminChallenge) {
    if (!c.id) { return; }
    if (!confirm(`Delete "${c.titre}"? This cannot be undone.`)) { return; }
    try {
      const user = await authState(this.auth).pipe(first()).toPromise();
      const token = user ? await user.getIdToken() : '';
      await this.http.delete('/api/admin/challenges/' + c.id,
        { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }
      ).toPromise();
      this.toastr.success('Deleted');
      this.challenges = this.challenges.filter(x => x.id !== c.id);
    } catch (err) {
      const e: any = err;
      this.toastr.error((e && e.error && e.error.error) || (e && e.message) || 'Delete failed');
    }
  }

  competencyLabel(tag: CompetencyTag): string {
    return (COMPETENCY_LABELS as any)[tag] || tag;
  }
}
