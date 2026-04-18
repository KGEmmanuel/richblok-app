import { UploadFileComponent } from './RibComponents/upload-file/upload-file.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetComponent } from './auth/reset/reset.component';
// FeedComponent lazy-loaded (V5 Sprint 0 standalone migration)
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { SecureInnerPagesGuard } from './shared/guard/secure-inner-pages.guard.ts.guard';
import { AuthGuard } from './shared/guard/auth.guard';
import { UserComponent } from './user/user.component';
// LandingComponent now loaded lazily (standalone component)
import { RecordComponent } from './record/record.component';
import { JobsComponent } from './jobs/jobs.component';
import { ChatComponent } from './chat/chat.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CvComponent } from './cv/cv.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationProfileComponent } from './organisation/organisation-profile/organisation-profile.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { UserViewComponent } from './user-view/user-view.component';
// Week 4: DemonstrateComponent retired. The V4 "Demonstrate" flow
// (self-recorded skill-proof media uploads) was superseded by the V5
// challenge + STAR credentialing loop. The component files remain on disk
// but are no longer routed or declared in AppModule.
import { EvaluateComponent } from './evaluate/evaluate.component';
import { ParticipateToChallengeComponent } from './evaluate/evaluate-list/participate-to-challenge/participate-to-challenge.component';
import { FriendsComponent } from './user/friends/friends.component';
import { CreateOrganisationComponent } from './create-organisation/create-organisation.component';
import { OrganisationSettingsComponent } from './organisation/organisation-settings/organisation-settings.component';
import { TermsComponent } from './RibComponents/terms/terms.component';
import { PolicyComponent } from './RibComponents/policy/policy.component';
import { ContactComponent } from './RibComponents/contact/contact.component';
import { JobProfileComponent } from './job-profile/job-profile.component';
import { UserJobProfileComponent } from './job-profile/user-job-profile/user-job-profile.component';
import { JobsPostComponent } from './jobs/jobs-post/jobs-post.component';
// Week 4: the 5 JobStepN components are still declared in AppModule so the
// wizard (JobsPostComponent) can render them inline, but they no longer have
// their own routes.
import { OrganisationViewComponent } from './organisation-view/organisation-view.component';
import { EvaluateFormComponent } from './evaluate/evaluate-form/evaluate-form.component';
import { JobProcessComponent } from './job-profile/job-process/job-process.component';
import { NotfoundComponent } from './RibComponents/notfound/notfound.component';
// BadgePageComponent lazy-loaded (standalone)
import { AdminSeedComponent } from './admin-seed/admin-seed.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserResolverComponent } from './user-resolver/user-resolver.component';
// StarProfileComponent + AiCoachComponent lazy-loaded (standalone)
import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component';
import { UniversityDashboardComponent } from './university-dashboard/university-dashboard.component';
// OnboardComponent lazy-loaded (standalone)
import { AdminChallengesComponent } from './admin-challenges/admin-challenges.component';
// SponsorChallengeComponent lazy-loaded (standalone)

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },

  { path: 'sign-in', component: LoginComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Create Account'} },
  { path: 'register', component: SignupComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Register'} },
  // Week-1 IA: /me is the unified user hub. /feed and /profile (self) redirect
  // into it at the right tab. Old URLs keep working — bookmarks, email links,
  // and Google rankings carry over.
  //
  // /record stays available as the legacy editor because the Portfolio tab
  // in /me links INTO it (via ?section=X) for CRUD. Fully absorbing the
  // record sub-forms into /me is a Week-2 follow-up that requires
  // converting record-experiences, record-skills, etc. to standalone.
  { path: 'me',
    loadComponent: () => import('./me/me.component').then(m => m.MeComponent),
    canActivate: [AuthGuard],
    data: {title: 'Your hub'} },
  // pathMatch:'full' — only the EXACT old URL redirects, not sub-paths.
  { path: 'feed',    redirectTo: '/me?tab=feed', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/me?tab=feed', pathMatch: 'full' },
  // /profile/:id stays public — that's "view someone else's profile".
  // It is NOT the same as /me (self). The canonical public URL is /u/:handle.
  { path: 'profile/:id', component: UserViewComponent},
  { path: 'organisation/:id', component: OrganisationProfileComponent},
  { path: 'messages', component: ChatComponent, canActivate: [AuthGuard], data: {title: 'Chat'}},
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard], data: {title: 'Notifications'}},
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard], data: {title: 'Jobs'}},
  { path: 'organisation', component: OrganisationProfileComponent, canActivate: [AuthGuard]},
  // /record — legacy editor reachable from /me?tab=portfolio tiles.
  // Kept active until Week-2 absorbs all 6 sub-forms into /me directly.
  { path: 'record', component: RecordComponent, canActivate: [AuthGuard], data: {title: 'Edit portfolio'}},
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard], data: {title: 'Connections'}},
  { path: 'settings', component: UserSettingsComponent, canActivate: [AuthGuard], data: {title: 'Settings'}},
  { path: 'cv', component: CvComponent, canActivate: [AuthGuard], data: {title: 'CV'}},
  { path: 'landing', loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent), data: {title: 'Landing'}},
  { path: 'forgot-password', component: ResetComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  // Week 4: /demonstrate retired (see note at imports).
  { path: 'demonstrate', redirectTo: '/me?tab=portfolio', pathMatch: 'full' },
  { path: 'evaluate', component: EvaluateComponent, canActivate: [AuthGuard], data: {title: 'Evaluate'}},
  { path: 'participate', component: ParticipateToChallengeComponent, canActivate: [AuthGuard], data: {title: 'Participate'}},
  { path: 'create-organisation', component: CreateOrganisationComponent, canActivate: [AuthGuard]},
  { path: 'organisation-settings', component: OrganisationSettingsComponent, canActivate: [AuthGuard]},
  { path: 'terms', component: TermsComponent},
  { path: 'policy', component: PolicyComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'job-profile/:id', component: UserJobProfileComponent},
  { path: 'job-process/:id', component: JobProcessComponent},
  // Week 4: unified job-posting wizard — /post-jobs is the single entry.
  // Old deep-link URLs redirect into the wizard; the wizard picks the right
  // step from the draft's currentStep.
  { path: 'post-jobs', component: JobsPostComponent, canActivate: [AuthGuard], data: {title: 'Post a job'}},
  { path: 'post-jobs/:id', component: JobsPostComponent, canActivate: [AuthGuard], data: {title: 'Post a job'}},
  { path: 'post-job-step-one', redirectTo: '/post-jobs', pathMatch: 'full' },
  { path: 'post-job-step-two', redirectTo: '/post-jobs', pathMatch: 'full' },
  { path: 'post-job-step-three', redirectTo: '/post-jobs', pathMatch: 'full' },
  { path: 'post-job-step-four', redirectTo: '/post-jobs', pathMatch: 'full' },
  { path: 'post-job-step-five', redirectTo: '/post-jobs', pathMatch: 'full' },
  // Week 4: /demo routes retired alongside /demonstrate.
  { path: 'demo', redirectTo: '/me?tab=portfolio', pathMatch: 'full' },
  { path: 'demo/:type/:id', redirectTo: '/me?tab=portfolio' },
  { path: 'participate-to-challenge/:id', component: ParticipateToChallengeComponent, canActivate: [AuthGuard] },
  { path: 'create-challenge', component: EvaluateFormComponent, canActivate: [AuthGuard]},
  // Week 4: /search retired. The old page was a hollow mockup with stock-
  // photo placeholders and no wired-up search backend. Sending users to the
  // AI-native discovery index is the closest real "browse talent" surface.
  { path: 'search', redirectTo: '/ai-native', pathMatch: 'full' },
  { path: 'badge/:id', loadComponent: () => import('./badge/badge-page.component').then(m => m.BadgePageComponent), data: {title: 'Verified Badge'} },
  { path: 'u/:handle', component: UserResolverComponent, data: {title: 'Profile'} },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: {title: 'Admin'} },
  { path: 'admin/seed-challenges', component: AdminSeedComponent, canActivate: [AuthGuard], data: {title: 'Admin · Seed'}},
  { path: 'admin/challenges', component: AdminChallengesComponent, canActivate: [AuthGuard], data: {title: 'Admin · Challenges'}},
  { path: 'admin/ai-pair/review',
    loadComponent: () => import('./admin-ai-pair-review/admin-ai-pair-review.component').then(m => m.AdminAiPairReviewComponent),
    canActivate: [AuthGuard],
    data: {title: 'Admin · AI-pair review'} },
  { path: 'sponsor', loadComponent: () => import('./sponsor-challenge/sponsor-challenge.component').then(m => m.SponsorChallengeComponent), data: {title: 'Sponsor a challenge'}},
  // F17 — AI-pair challenge format. Requires AuthGuard because submission issues a badge record.
  { path: 'ai-pair/:slug', loadComponent: () => import('./ai-pair-challenge/ai-pair-challenge.component').then(m => m.AiPairChallengeComponent), canActivate: [AuthGuard], data: {title: 'AI-pair challenge'}},
  // F23 — public SEO discovery page for AI-native badge holders. No AuthGuard.
  { path: 'ai-native',
    loadComponent: () => import('./ai-native-discovery/ai-native-discovery.component').then(m => m.AiNativeDiscoveryComponent),
    data: {title: 'Verified AI-native engineers'} },
  // F24 — public weekly leaderboard. No AuthGuard; backed by /api/leaderboard (60s cache).
  { path: 'leaderboard',
    loadComponent: () => import('./leaderboard/leaderboard.component').then(m => m.LeaderboardComponent),
    data: {title: 'Weekly leaderboard'} },
  { path: 'onboard', loadComponent: () => import('./onboard/onboard.component').then(m => m.OnboardComponent), data: {title: 'Upload your CV'} },
  { path: 'star/:id', loadComponent: () => import('./star-profile/star-profile.component').then(m => m.StarProfileComponent), data: {title: 'STAR Profile'} },
  { path: 'coach/:id', loadComponent: () => import('./ai-coach/ai-coach.component').then(m => m.AiCoachComponent), canActivate: [AuthGuard], data: {title: 'AI Interview Coach'} },
  { path: 'employer/dashboard', component: EmployerDashboardComponent, canActivate: [AuthGuard], data: {title: 'Employer · Talent'} },
  { path: 'employer', redirectTo: 'employer/dashboard', pathMatch: 'full' },
  { path: 'university/dashboard', component: UniversityDashboardComponent, canActivate: [AuthGuard], data: {title: 'University · Cohort'} },
  { path: 'university', redirectTo: 'university/dashboard', pathMatch: 'full' },
  { path: '404', component: NotfoundComponent },
  { path: 'upload', component: UploadFileComponent },
  { path: '**', component: NotfoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      useHash: false
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
