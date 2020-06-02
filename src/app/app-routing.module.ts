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

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'sign-in', component: LoginComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Create Account'} },
  { path: 'register', component: SignupComponent, canActivate: [SecureInnerPagesGuard], data: {title: 'Register'} },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard], data: {title: 'Feed'} },
  { path: 'profile/:id', component: UserComponent, data: {title: 'Profile'}},
  { path: 'profile/:id', component: UserViewComponent},
  { path: 'organisation/:id', component: OrganisationProfileComponent},
  { path: 'messages', component: ChatComponent, data: {title: 'Chat'}},
  { path: 'notifications', component: NotificationsComponent, data: {title: 'Notifications'}},
  { path: 'jobs', component: JobsComponent, data: {title: 'Jobs'}},
  { path: 'organisation', component: OrganisationProfileComponent},
  { path: 'record', component: RecordComponent, data: {title: 'Records'}},
  { path: 'friends', component: FriendsComponent, data: {title: 'Connections'}},
  { path: 'settings', component: UserSettingsComponent, data: {title: 'Settings'}},
  { path: 'cv', component: CvComponent, data: {title: 'CV'}},
  { path: 'landing', component: LandingComponent, data: {title: 'Landing'}},
  { path: 'forgot-password', component: ResetComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'demonstrate', component: DemonstrateComponent, data: {title: 'Demonstrate'}},
  { path: 'evaluate', component: EvaluateComponent, data: {title: 'Evaluate'}},
  { path: 'participate', component: ParticipateToChallengeComponent, data: {title: 'Participate'}},
  { path: 'create-organisation', component: CreateOrganisationComponent},
  { path: 'organisation-settings', component: OrganisationSettingsComponent},
  { path: 'terms', component: TermsComponent},
  { path: 'policy', component: PolicyComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'job-profile/:id', component: UserJobProfileComponent},
  { path: 'job-process/:id', component: JobProcessComponent},
  { path: 'post-jobs', component: JobsPostComponent},
  { path: 'post-job-step-one', component: JobStep1Component},
  { path: 'post-job-step-two', component: JobStep2Component},
  { path: 'post-job-step-three', component: JobStep3Component},
  { path: 'post-job-step-four', component: JobStep4Component},
  { path: 'post-job-step-five', component: JobStep5Component},
  { path: 'demo/:type/:id', component: DemonstrateFormComponent},
  { path: 'demo', component: DemonstrateFormComponent},
  { path: 'landing', component: LandingComponent},
  { path: 'participate-to-challenge/:id', component: ParticipateToChallengeComponent },
  { path: 'create-challenge', component: EvaluateFormComponent},
  { path: 'search', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
