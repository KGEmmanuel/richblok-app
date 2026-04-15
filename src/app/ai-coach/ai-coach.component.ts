import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StarMapperService } from '../shared/services/star-mapper.service';
import { AnalyticsService } from '../shared/services/analytics.service';
import { StarProfile, StarAnswer } from '../shared/entites/StarProfile';

interface ChatMessage {
  role: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-coach',
  templateUrl: './ai-coach.component.html',
  styleUrls: ['./ai-coach.component.scss']
})
export class AiCoachComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollAnchor') scrollAnchor: ElementRef<HTMLDivElement>;

  profile: StarProfile | null = null;
  activeAnswerIndex = 0;
  loading = true;
  messages: ChatMessage[] = [];
  input = '';
  sending = false;
  shouldScroll = false;

  readonly suggestedPrompts = [
    'Make my Result stronger with a specific number.',
    'My Action sounds generic. Rewrite it.',
    'Turn this into a 30-second verbal version.',
    'What follow-up question will the interviewer ask?'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private starMapper: StarMapperService,
    private http: HttpClient,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.activeAnswerIndex = parseInt(this.route.snapshot.queryParamMap.get('a') || '0', 10);

    if (!id) { this.router.navigate(['/landing']); return; }

    this.starMapper.get(id).subscribe(p => {
      this.loading = false;
      if (!p) {
        this.router.navigate(['/landing']);
        return;
      }
      this.profile = p;
      if (this.activeAnswerIndex >= p.answers.length) { this.activeAnswerIndex = 0; }
      this.seedGreeting();
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll && this.scrollAnchor) {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      this.shouldScroll = false;
    }
  }

  get activeAnswer(): StarAnswer | null {
    return this.profile ? this.profile.answers[this.activeAnswerIndex] : null;
  }

  switchAnswer(i: number) {
    if (!this.profile) { return; }
    this.activeAnswerIndex = i;
    this.messages = [];
    this.seedGreeting();
  }

  usePrompt(p: string) {
    this.input = p;
    this.send();
  }

  async send() {
    const text = (this.input || '').trim();
    if (!text || this.sending || !this.activeAnswer) { return; }

    this.messages.push({ role: 'user', text, timestamp: new Date() });
    this.input = '';
    this.sending = true;
    this.shouldScroll = true;

    this.analytics.track('AICoachMessage', {
      profileId: this.profile?.id,
      competency: this.activeAnswer.competency
    });

    try {
      const resp: any = await this.http.post('/api/coach', {
        answer: this.activeAnswer,
        userMessage: text,
        projectContext: this.profile?.challengeTitle
      }).toPromise();
      this.messages.push({
        role: 'coach',
        text: resp.reply || 'Let me help you improve this answer.',
        timestamp: new Date()
      });
      this.shouldScroll = true;
    } catch (err) {
      this.messages.push({
        role: 'coach',
        text: 'I had trouble connecting right now. Try rephrasing — I read everything you write.',
        timestamp: new Date()
      });
    } finally {
      this.sending = false;
    }
  }

  private seedGreeting() {
    const a = this.activeAnswer;
    if (!a) { return; }
    this.messages = [{
      role: 'coach',
      text: `Let's sharpen your "${a.competencyLabel}" answer for the question: "${a.question}"\n\nI've read your draft. Ask me anything — or try one of the suggestions below to tighten your Situation, Task, Action, or Result.`,
      timestamp: new Date()
    }];
    this.shouldScroll = true;
  }
}
