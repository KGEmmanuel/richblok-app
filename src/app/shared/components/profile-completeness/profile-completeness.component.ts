import { Component, Input, OnChanges } from '@angular/core';
import { Utilisateur } from '../../entites/Utilisateur';
import { ProfileCompletenessService, ProfileScore } from '../../services/profile-completeness.service';

@Component({
  selector: 'app-profile-completeness',
  templateUrl: './profile-completeness.component.html',
  styleUrls: ['./profile-completeness.component.scss']
})
export class ProfileCompletenessComponent implements OnChanges {

  @Input() user: Utilisateur;
  @Input() skillsCount = 0;
  @Input() experienceCount = 0;
  @Input() certificationCount = 0;
  @Input() challengeCount = 0;

  score: ProfileScore | null = null;
  expanded = false;

  constructor(private completeness: ProfileCompletenessService) {}

  ngOnChanges(): void {
    if (this.user) {
      this.score = this.completeness.calculateScore(this.user, {
        skillsCount: this.skillsCount,
        experienceCount: this.experienceCount,
        certificationCount: this.certificationCount,
        challengeCount: this.challengeCount
      });
    }
  }

  get progressColor(): string {
    if (!this.score) { return '#999'; }
    if (this.score.total >= 80) { return '#4caf50'; }
    if (this.score.total >= 50) { return '#ff9800'; }
    return '#f44336';
  }

  get statusLabel(): string {
    if (!this.score) { return ''; }
    if (this.score.total >= 80) { return 'Recruiter-ready'; }
    if (this.score.total >= 50) { return 'Almost there'; }
    return 'Just getting started';
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
