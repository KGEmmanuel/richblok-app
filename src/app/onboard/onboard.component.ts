import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { AnalyticsService } from '../shared/services/analytics.service';
import { StarMapperService } from '../shared/services/star-mapper.service';
import { first } from 'rxjs/operators';

interface ExtractedCv {
  profile?: { fullName?: string; headline?: string; location?: string; email?: string };
  experiences?: Array<{ role: string; company: string; location?: string; startDate?: string; endDate?: string; duration?: string; description?: string; achievements?: string[] }>;
  projects?: Array<{ name: string; description?: string; tech?: string[]; impact?: string }>;
  education?: Array<{ school: string; degree?: string; field?: string; years?: string }>;
  skills?: string[];
}

type Step = 'upload' | 'extracting' | 'preview' | 'generating' | 'error';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit {
  // D7 Day 2 — modular Auth via inject().
  private auth = inject(Auth);

  step: Step = 'upload';
  mode: 'pdf' | 'text' = 'pdf';

  // PDF mode
  fileName = '';
  fileSize = 0;
  dragging = false;

  // Text mode
  pastedText = '';

  // Results
  extracted: ExtractedCv | null = null;
  errorMsg = '';

  // Progress messaging (playful while waiting)
  extractingMessages = [
    'Reading your CV…',
    'Finding your wins…',
    'Mapping experiences to behavioral competencies…',
    'Drafting STAR answers…'
  ];
  extractingIndex = 0;
  private progressTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    
    private analytics: AnalyticsService,
    private starMapper: StarMapperService
  ) {}

  ngOnInit() {
    this.analytics.pageView('onboard');
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.dragging = false;
    const file = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (file) { this.handleFile(file); }
  }
  onDragOver(ev: DragEvent) { ev.preventDefault(); this.dragging = true; }
  onDragLeave() { this.dragging = false; }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file) { this.handleFile(file); }
  }

  private async handleFile(file: File) {
    // Validate
    if (file.size > 8 * 1024 * 1024) {
      this.errorMsg = 'File is larger than 8 MB. Please use a smaller PDF or paste the text.';
      this.step = 'error';
      return;
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      this.errorMsg = 'Only PDF files are supported right now. You can also paste your CV as text below.';
      this.step = 'error';
      return;
    }

    this.fileName = file.name;
    this.fileSize = file.size;
    this.analytics.track('CvUploadStart', { method: 'pdf', size: file.size });

    this.step = 'extracting';
    this.startProgressMessages();

    try {
      const base64 = await this.fileToBase64(file);
      const resp = await this.http.post<any>('/api/cv-extract', {
        source: 'pdf',
        filename: file.name,
        base64
      }).toPromise();

      if (resp.error && !resp.experiences) {
        this.errorMsg = resp.error;
        this.step = 'error';
        return;
      }
      this.extracted = resp;
      this.step = 'preview';
      this.stopProgressMessages();
      this.analytics.track('CvUploadSuccess', {
        method: 'pdf',
        experiences: (resp.experiences || []).length,
        projects: (resp.projects || []).length,
        skills: (resp.skills || []).length
      });
    } catch (err) {
      this.stopProgressMessages();
      this.errorMsg = (err as any).message || 'Something went wrong. Try pasting your CV as text.';
      this.step = 'error';
    }
  }

  async submitText() {
    if (!this.pastedText || this.pastedText.trim().length < 120) {
      this.errorMsg = 'Paste at least a paragraph of your CV.';
      return;
    }
    this.analytics.track('CvUploadStart', { method: 'text', length: this.pastedText.length });
    this.step = 'extracting';
    this.startProgressMessages();
    try {
      const resp = await this.http.post<any>('/api/cv-extract', {
        source: 'text',
        text: this.pastedText
      }).toPromise();
      if (resp.error && !resp.experiences) {
        this.errorMsg = resp.error;
        this.step = 'error';
        return;
      }
      this.extracted = resp;
      this.step = 'preview';
      this.stopProgressMessages();
      this.analytics.track('CvUploadSuccess', { method: 'text' });
    } catch (err) {
      this.stopProgressMessages();
      this.errorMsg = (err as any).message || 'Could not extract. Please try again.';
      this.step = 'error';
    }
  }

  async generateStarStories() {
    if (!this.extracted) { return; }
    this.step = 'generating';
    this.extractingIndex = 2;  // "drafting STAR answers..."
    this.startProgressMessages();

    const user = await authState(this.auth).pipe(first()).toPromise();
    const uid = user ? user.uid : 'anonymous';

    this.analytics.track('CvToStarStart', { uid });

    // One automatic retry: the Anthropic round-trip on a 3-page CV can take
    // 20-40s and occasionally times out at the edge. The earlier version
    // silently swallowed failures into an empty profile ("0 draft interview
    // stories"); we now retry once before surfacing the error.
    const attempt = async (): Promise<any> =>
      this.starMapper.generateFromCv({
        uid,
        cvData: this.extracted,
        userName: (this.extracted.profile && this.extracted.profile.fullName) || ''
      }).toPromise();

    let profile: any = null;
    let lastErr: any = null;
    for (let i = 0; i < 2; i++) {
      try {
        profile = await attempt();
        if (profile && Array.isArray(profile.answers) && profile.answers.length > 0) { break; }
        lastErr = new Error('Extractor returned no answers.');
      } catch (err) {
        lastErr = err;
      }
    }

    this.stopProgressMessages();

    if (!profile || !profile.answers?.length) {
      this.analytics.track('CvToStarFailed', {
        uid,
        message: lastErr?.message || 'unknown'
      });
      this.errorMsg = (lastErr?.message && lastErr.message.length < 200)
        ? lastErr.message
        : 'The STAR drafter timed out. Your CV extraction is saved — try again.';
      this.step = 'error';
      return;
    }

    this.analytics.track('CvToStarSuccess', {
      profileId: profile.id,
      answerCount: profile.answers.length
    });

    // If not logged in, send them to register with the generated draft stashed in localStorage
    // (handled by /register flow on first login — draft is auto-claimed).
    if (!user) {
      try {
        localStorage.setItem('richblok_pending_star', JSON.stringify({ id: profile.id }));
      } catch { /* ignore */ }
      this.router.navigate(['/register'], { queryParams: { from: 'cv' } });
    } else {
      this.router.navigate(['/star', profile.id], { queryParams: { fromCv: 1 } });
    }
  }

  reset() {
    this.step = 'upload';
    this.errorMsg = '';
    this.extracted = null;
    this.fileName = '';
    this.pastedText = '';
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = reader.result as string;
        // Strip the "data:application/pdf;base64," prefix
        const comma = raw.indexOf(',');
        resolve(comma > 0 ? raw.substring(comma + 1) : raw);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  get extractingMessage() { return this.extractingMessages[this.extractingIndex]; }

  private startProgressMessages() {
    this.extractingIndex = 0;
    if (this.progressTimer) { clearInterval(this.progressTimer); }
    this.progressTimer = setInterval(() => {
      if (this.extractingIndex < this.extractingMessages.length - 1) {
        this.extractingIndex++;
      }
    }, 2500);
  }
  private stopProgressMessages() {
    if (this.progressTimer) { clearInterval(this.progressTimer); this.progressTimer = null; }
  }

  get kb(): number { return Math.round(this.fileSize / 1024); }
  get expCount(): number { return (this.extracted && this.extracted.experiences) ? this.extracted.experiences.length : 0; }
  get projectCount(): number { return (this.extracted && this.extracted.projects) ? this.extracted.projects.length : 0; }
  get skillCount(): number { return (this.extracted && this.extracted.skills) ? this.extracted.skills.length : 0; }
}
