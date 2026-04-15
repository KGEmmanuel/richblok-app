import { Injectable } from '@angular/core';
import { Utilisateur } from '../entites/Utilisateur';

export interface ProfileScore {
  total: number;
  sections: {
    name: string;
    score: number;
    maxScore: number;
    completed: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfileCompletenessService {

  calculateScore(user: Utilisateur, extras?: {
    skillsCount?: number;
    experienceCount?: number;
    certificationCount?: number;
    challengeCount?: number;
  }): ProfileScore {
    const sections = [
      {
        name: 'Display Name',
        score: user && user.nom ? 10 : 0,
        maxScore: 10,
        completed: !!(user && user.nom)
      },
      {
        name: 'Bio / About',
        score: user && user.accroche ? 10 : 0,
        maxScore: 10,
        completed: !!(user && user.accroche)
      },
      {
        name: 'Profile Photo',
        score: user && user.imageprofil ? 10 : 0,
        maxScore: 10,
        completed: !!(user && user.imageprofil)
      },
      {
        name: 'Location',
        score: user && user.lieu ? 10 : 0,
        maxScore: 10,
        completed: !!(user && user.lieu)
      },
      {
        name: 'Skills (3+)',
        score: (extras && extras.skillsCount || 0) >= 3 ? 20 : 0,
        maxScore: 20,
        completed: (extras && extras.skillsCount || 0) >= 3
      },
      {
        name: 'Experience (1+)',
        score: (extras && extras.experienceCount || 0) >= 1 ? 15 : 0,
        maxScore: 15,
        completed: (extras && extras.experienceCount || 0) >= 1
      },
      {
        name: 'Certification (1+)',
        score: (extras && extras.certificationCount || 0) >= 1 ? 15 : 0,
        maxScore: 15,
        completed: (extras && extras.certificationCount || 0) >= 1
      },
      {
        name: 'Challenge Completed (1+)',
        score: (extras && extras.challengeCount || 0) >= 1 ? 10 : 0,
        maxScore: 10,
        completed: (extras && extras.challengeCount || 0) >= 1
      }
    ];

    const total = sections.reduce((sum, s) => sum + s.score, 0);

    return { total, sections };
  }
}
