import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// MVP Sprint A — one rule: if a route does not earn a badge, show a badge,
// sell a Pro subscription, or request an intro, it is not in MVP. Everything
// else redirects into the MVP surface or 404s. The deferred component files
// remain on disk (declared in AppModule) but are no longer routed.

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetComponent } from './auth/reset/reset.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { SecureInnerPagesGuard } from './shared/guard/secure-inner-pages.guard.ts.guard';
import { AuthGuard } from './shared/guard/auth.guard';

import { UserViewComponent } from './user-view/user-view.component';
import { UserResolverComponent } from './user-resolver/user-resolver.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';

import { EvaluateComponent } from './evaluate/evaluate.component';
import { ParticipateToChallengeComponent } from './evaluate/evaluate-list/participate-to-challenge/participate-to-challenge.component';

import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component';
import { UniversityDashboardComponent } from './university-dashboard/university-dashboard.component';

import { TermsComponent } from './RibComponents/terms/terms.component';
import { PolicyComponent } from './RibComponents/policy/policy.component';
import { ContactComponent } from './RibComponents/contact/contact.component';
import { NotfoundComponent } from './RibComponents/notfound/notfound.component';

import { AdminSeedComponent } from './admin-seed/admin-seed.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminChallengesComponent } from './admin-challenges/admin-challenges.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },

  // --- Acquisition + auth ---
  { path: 'landing', loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent), data: {title: 'Landing'} },
  { path: 'sign-in', component: LoginComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Sign in'} },
  { path: 'register', component: SignupComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Register'} },
  { path: 'forgot-password', component: ResetComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },

  // --- CV-first funnel (the primary signup path per PRD) ---
  { path: 'onboard', loadComponent: () => import('./onboard/onboard.component').then(m => m.OnboardComponent), data: {title: 'Upload your CV'} },

  // --- Logged-in hub (Feed + Badges tabs only — Portfolio/CV tabs retired) ---
  { path: 'me', loadComponent: () => import('./me/me.component').then(m => m.MeComponent), canActivate: [AuthGuard], data: {title: 'Your hub'} },

  // --- Back-compat redirects for bookmarks/old links ---
  { path: 'feed',    redirectTo: '/me?tab=feed', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/me?tab=feed', pathMatch: 'full' },

  // --- Public profile view (someone else's) ---
  { path: 'profile/:id', component: UserViewComponent },
  { path: 'u/:handle',   component: UserResolverComponent, data: {title: 'Profile'} },

  // --- Credential surfaces (the shareable URLs) ---
  { path: 'badge/:id', loadComponent: () => import('./badge/badge-page.component').then(m => m.BadgePageComponent), data: {title: 'Verified Badge'} },
  { path: 'star/:id',  loadComponent: () => import('./star-profile/star-profile.component').then(m => m.StarProfileComponent), data: {title: 'STAR Profile'} },
  { path: 'coach/:id', loadComponent: () => import('./ai-coach/ai-coach.component').then(m => m.AiCoachComponent), canActivate: [AuthGuard], data: {title: 'AI Interview Coach'} },

  // --- Challenge catalog + runners ---
  { path: 'evaluate', component: EvaluateComponent, canActivate: [AuthGuard], data: {title: 'Challenges'} },
  { path: 'ai-pair/:slug', loadComponent: () => import('./ai-pair-challenge/ai-pair-challenge.component').then(m => m.AiPairChallengeComponent), canActivate: [AuthGuard], data: {title: 'AI-pair challenge'} },
  { path: 'participate-to-challenge/:id', component: ParticipateToChallengeComponent, canActivate: [AuthGuard] },

  // --- Self-serve profile + pricing ---
  { path: 'settings', component: UserSettingsComponent, canActivate: [AuthGuard], data: {title: 'Settings'} },

  // --- Public directory + leaderboard (employer browse + viral hook) ---
  { path: 'ai-native',   loadComponent: () => import('./ai-native-discovery/ai-native-discovery.component').then(m => m.AiNativeDiscoveryComponent), data: {title: 'Verified AI-native engineers'} },
  { path: 'leaderboard', loadComponent: () => import('./leaderboard/leaderboard.component').then(m => m.LeaderboardComponent), data: {title: 'Weekly leaderboard'} },

  // --- Paying employer surface ---
  { path: 'employer/dashboard', component: EmployerDashboardComponent, canActivate: [AuthGuard], data: {title: 'Employer · Talent'} },
  { path: 'employer',           redirectTo: 'employer/dashboard', pathMatch: 'full' },

  // --- University pilot (kept active; small scope) ---
  { path: 'university/dashboard', component: UniversityDashboardComponent, canActivate: [AuthGuard], data: {title: 'University · Cohort'} },
  { path: 'university',           redirectTo: 'university/dashboard', pathMatch: 'full' },

  // --- Sponsor challenge (AI-tool vendor pitch page) ---
  { path: 'sponsor', loadComponent: () => import('./sponsor-challenge/sponsor-challenge.component').then(m => m.SponsorChallengeComponent), data: {title: 'Sponsor a challenge'} },

  // --- Admin (gated by role, not route) ---
  { path: 'admin',                  component: AdminDashboardComponent,  canActivate: [AuthGuard], data: {title: 'Admin'} },
  { path: 'admin/seed-challenges',  component: AdminSeedComponent,       canActivate: [AuthGuard], data: {title: 'Admin · Seed'} },
  { path: 'admin/challenges',       component: AdminChallengesComponent, canActivate: [AuthGuard], data: {title: 'Admin · Challenges'} },
  { path: 'admin/ai-pair/review',   loadComponent: () => import('./admin-ai-pair-review/admin-ai-pair-review.component').then(m => m.AdminAiPairReviewComponent), canActivate: [AuthGuard], data: {title: 'Admin · AI-pair review'} },

  // --- Legal / utility ---
  { path: 'terms',   component: TermsComponent },
  { path: 'policy',  component: PolicyComponent },
  { path: 'contact', component: ContactComponent },

  // --- MVP Sprint A — routes DEFERRED. They redirect to the nearest MVP
  // surface so bookmarks, outbound email links, and Google-indexed URLs
  // don't 404. Each line links to an MVP surface that serves the same
  // user intent, not a generic home. ---
  { path: 'jobs',                   redirectTo: '/evaluate',          pathMatch: 'full' },  // no real jobs → challenges are the action
  { path: 'post-jobs',              redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'post-jobs/:id',          redirectTo: '/employer/dashboard' },
  { path: 'post-job-step-one',      redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'post-job-step-two',      redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'post-job-step-three',    redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'post-job-step-four',     redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'post-job-step-five',     redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'job-profile/:id',        redirectTo: '/evaluate' },
  { path: 'job-process/:id',        redirectTo: '/employer/dashboard' },

  { path: 'friends',                redirectTo: '/me',                pathMatch: 'full' },  // social is not PRD
  { path: 'messages',               redirectTo: '/me',                pathMatch: 'full' },
  { path: 'notifications',          redirectTo: '/me',                pathMatch: 'full' },

  { path: 'record',                 redirectTo: '/me?tab=badges',     pathMatch: 'full' },  // badges are the portfolio
  { path: 'cv',                     redirectTo: '/onboard',           pathMatch: 'full' },  // CV is an input, not an editable feature

  { path: 'create-organisation',    redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'organisation',           redirectTo: '/employer/dashboard', pathMatch: 'full' },
  { path: 'organisation/:id',       redirectTo: '/employer/dashboard' },
  { path: 'organisation-settings',  redirectTo: '/settings',          pathMatch: 'full' },

  { path: 'create-challenge',       redirectTo: '/admin/challenges',  pathMatch: 'full' },  // challenge creation is admin-only now
  { path: 'participate',            redirectTo: '/evaluate',          pathMatch: 'full' },

  // Week 4 redirects preserved
  { path: 'search',      redirectTo: '/ai-native',         pathMatch: 'full' },
  { path: 'demonstrate', redirectTo: '/me?tab=badges',     pathMatch: 'full' },
  { path: 'demo',        redirectTo: '/me?tab=badges',     pathMatch: 'full' },
  { path: 'demo/:type/:id', redirectTo: '/me?tab=badges' },

  { path: '404',    component: NotfoundComponent },
  { path: '**',     component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
