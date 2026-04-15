import { UploadFileComponent } from './RibComponents/upload-file/upload-file.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetComponent } from './auth/reset/reset.component';
import { FeedComponent } from './feed/feed.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { SecureInnerPagesGuard } from './shared/guard/secure-inner-pages.guard.ts.guard';
import { AuthGuard } from './shared/guard/auth.guard';
import { UserComponent } from './user/user.component';
import { LandingComponent } from './landing/landing.component';
import { RecordComponent } from './record/record.component';
import { JobsComponent } from './jobs/jobs.component';
import { ChatComponent } from './chat/chat.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CvComponent } from './cv/cv.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationProfileComponent } from './organisation/organisation-profile/organisation-profile.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { UserViewComponent } from './user-view/user-view.component';
import { DemonstrateComponent } from './demonstrate/demonstrate.component';
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
import { JobStep1Component } from './jobs/jobs-post/job-step1/job-step1.component';
import { JobStep2Component } from './jobs/jobs-post/job-step2/job-step2.component';
import { JobStep3Component } from './jobs/jobs-post/job-step3/job-step3.component';
import { JobStep4Component } from './jobs/jobs-post/job-step4/job-step4.component';
import { JobStep5Component } from './jobs/jobs-post/job-step5/job-step5.component';
import { DemonstrateFormComponent } from './demonstrate/demonstrate-form/demonstrate-form.component';
import { OrganisationViewComponent } from './organisation-view/organisation-view.component';
import { EvaluateFormComponent } from './evaluate/evaluate-form/evaluate-form.component';
import { JobProcessComponent } from './job-profile/job-process/job-process.component';
import { SearchComponent } from './search/search.component';
import { NotfoundComponent } from './RibComponents/notfound/notfound.component';
import { BadgePageComponent } from './badge/badge-page.component';
import { AdminSeedComponent } from './admin-seed/admin-seed.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserResolverComponent } from './user-resolver/user-resolver.component';
import { StarProfileComponent } from './star-profile/star-profile.component';
import { AiCoachComponent } from './ai-coach/ai-coach.component';
import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component';
import { UniversityDashboardComponent } from './university-dashboard/university-dashboard.component';
import { OnboardComponent } from './onboard/onboard.component';
import { AdminChallengesComponent } from './admin-challenges/admin-challenges.component';
import { SponsorChallengeComponent } from './sponsor-challenge/sponsor-challenge.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },

  { path: 'sign-in', component: LoginComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Create Account'} },
  { path: 'register', component: SignupComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Register'} },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard], data: {title: 'Feed'} },
  { path: 'profile', component: UserComponent, canActivate: [AuthGuard], data: {title: 'Profile'}},
  { path: 'profile/:id', component: UserViewComponent},
  { path: 'organisation/:id', component: OrganisationProfileComponent},
  { path: 'messages', component: ChatComponent, canActivate: [AuthGuard], data: {title: 'Chat'}},
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard], data: {title: 'Notifications'}},
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard], data: {title: 'Jobs'}},
  { path: 'organisation', component: OrganisationProfileComponent, canActivate: [AuthGuard]},
  { path: 'record', component: RecordComponent, canActivate: [AuthGuard], data: {title: 'Records'}},
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard], data: {title: 'Connections'}},
  { path: 'settings', component: UserSettingsComponent, canActivate: [AuthGuard], data: {title: 'Settings'}},
  { path: 'cv', component: CvComponent, canActivate: [AuthGuard], data: {title: 'CV'}},
  { path: 'landing', component: LandingComponent, data: {title: 'Landing'}},
  { path: 'forgot-password', component: ResetComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'demonstrate', component: DemonstrateComponent, canActivate: [AuthGuard], data: {title: 'Demonstrate'}},
  { path: 'evaluate', component: EvaluateComponent, canActivate: [AuthGuard], data: {title: 'Evaluate'}},
  { path: 'participate', component: ParticipateToChallengeComponent, canActivate: [AuthGuard], data: {title: 'Participate'}},
  { path: 'create-organisation', component: CreateOrganisationComponent, canActivate: [AuthGuard]},
  { path: 'organisation-settings', component: OrganisationSettingsComponent, canActivate: [AuthGuard]},
  { path: 'terms', component: TermsComponent},
  { path: 'policy', component: PolicyComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'job-profile/:id', component: UserJobProfileComponent},
  { path: 'job-process/:id', component: JobProcessComponent},
  { path: 'post-jobs', component: JobsPostComponent, canActivate: [AuthGuard]},
  { path: 'post-job-step-one', component: JobStep1Component, canActivate: [AuthGuard]},
  { path: 'post-job-step-two', component: JobStep2Component, canActivate: [AuthGuard]},
  { path: 'post-job-step-three', component: JobStep3Component, canActivate: [AuthGuard]},
  { path: 'post-job-step-four', component: JobStep4Component, canActivate: [AuthGuard]},
  { path: 'post-job-step-five', component: JobStep5Component, canActivate: [AuthGuard]},
  { path: 'demo/:type/:id', component: DemonstrateFormComponent},
  { path: 'demo', component: DemonstrateFormComponent},
  { path: 'participate-to-challenge/:id', component: ParticipateToChallengeComponent, canActivate: [AuthGuard] },
  { path: 'create-challenge', component: EvaluateFormComponent, canActivate: [AuthGuard]},
  { path: 'search', component: SearchComponent},
  { path: 'badge/:id', component: BadgePageComponent, data: {title: 'Verified Badge'} },
  { path: 'u/:handle', component: UserResolverComponent, data: {title: 'Profile'} },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: {title: 'Admin'} },
  { path: 'admin/seed-challenges', component: AdminSeedComponent, canActivate: [AuthGuard], data: {title: 'Admin · Seed'}},
  { path: 'admin/challenges', component: AdminChallengesComponent, canActivate: [AuthGuard], data: {title: 'Admin · Challenges'}},
  { path: 'sponsor', component: SponsorChallengeComponent, data: {title: 'Sponsor a challenge'}},
  { path: 'onboard', component: OnboardComponent, data: {title: 'Upload your CV'} },
  { path: 'star/:id', component: StarProfileComponent, data: {title: 'STAR Profile'} },
  { path: 'coach/:id', component: AiCoachComponent, canActivate: [AuthGuard], data: {title: 'AI Interview Coach'} },
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
