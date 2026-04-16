import { ProgressComponent } from './RibComponents/progress/progress.component';
import { HttpClient, HttpHandler, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// removed: ngx-google-places-autocomplete@2 isn't Angular 16+ compatible;
// the post-form still type-references GooglePlaceDirective but the module
// import is dropped. Places autocomplete UI is degraded until replaced with
// Angular-16-compatible alternative.
import { ApiService } from '../app/feed/post/post-form/post-location/api.service';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetComponent } from './auth/reset/reset.component';
import { SignupComponent } from './auth/signup/signup.component';
// FeedComponent is standalone (V5 Sprint 0) — loaded via the route definition
import { PostItemComponent } from './feed/post/post-item/post-item.component';
import { PostFormComponent } from './feed/post/post-form/post-form.component';
import { RecordComponent } from './record/record.component';
import { RecordFormComponent } from './record/record-form/record-form.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingFormComponent } from './trainings/training-form/training-form.component';
import { TrainingItemComponent } from './trainings/training-item/training-item.component';
import { ExperiencesComponent } from './experiences/experiences.component';
import { ExperiencesFormComponent } from './experiences/experiences-form/experiences-form.component';
import { ExperiencesItemComponent } from './experiences/experiences-item/experiences-item.component';
import { SkillsComponent } from './skills/skills.component';
import { SkillDetailedFormComponent } from './skills/skill-detailed-form/skill-detailed-form.component';
import { SkillFormComponent } from './skills/skill-form/skill-form.component';
import { SkillItemComponent } from './skills/skill-item/skill-item.component';
import { DocumentsComponent } from './documents/documents.component';
import { DocumentFormComponent } from './documents/document-form/document-form.component';
import { DocumentItemComponent } from './documents/document-item/document-item.component';
import { UserComponent } from './user/user.component';
import { UserPublicProfilComponent } from './user/user-public-profil/user-public-profil.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { ArchiveItemComponent } from './RibComponents/archive-item/archive-item.component';
import { CertifyItemComponent } from './RibComponents/certify-item/certify-item.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationProfileComponent } from './organisation/organisation-profile/organisation-profile.component';
import { OrganisationsListComponent } from './organisation/organisations-list/organisations-list.component';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './user/user-card/user-card.component';
import { HeaderComponent } from './header/header.component';
import { UserAboutComponent } from './user/user-about/user-about.component';
// LandingComponent is standalone + lazy-loaded via router — not declared here
import { LandingTestimanialsComponent } from './landing/landing-testimanials/landing-testimanials.component';
import { PremiumComponent } from './RibComponents/premium/premium.component';
import { ConnectionAsideComponent } from './RibComponents/connection-aside/connection-aside.component';
import { ConnectionAsideItemComponent } from './RibComponents/connection-aside/connection-aside-item/connection-aside-item.component';
import { JobAsideComponent } from './RibComponents/job-aside/job-aside.component';
import { JobAsideItemComponent } from './RibComponents/job-aside/job-aside-item/job-aside-item.component';
import { RibSolutionsComponent } from './RibComponents/rib-solutions/rib-solutions.component';
import { ViewedProfileComponent } from './RibComponents/viewed-profile/viewed-profile.component';
import { ViewedProfileItemComponent } from './RibComponents/viewed-profile/viewed-profile-item/viewed-profile-item.component';
import { JobsComponent } from './jobs/jobs.component';
import { FooterComponent } from './footer/footer.component';
import { ChatComponent } from './chat/chat.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsItemsComponent } from './notifications/notifications-items/notifications-items.component';
import { PostItemDetailComponent } from './feed/post/post-item/post-item-detail/post-item-detail.component';
import { RecordSkillsComponent } from './record/record-skills/record-skills.component';
import { RecordSkillsItemComponent } from './record/record-skills/record-skills-item/record-skills-item.component';
import { RecordSkillsFormComponent } from './record/record-skills/record-skills-form/record-skills-form.component';
import { RecordExperiencesComponent } from './record/record-experiences/record-experiences.component';
import { RecordExperiencesItemComponent } from './record/record-experiences/record-experiences-item/record-experiences-item.component';
import { RecordExperiencesFormComponent } from './record/record-experiences/record-experiences-form/record-experiences-form.component';
import { RecordProTrainComponent } from './record/record-pro-train/record-pro-train.component';
import { RecordProTrainItemComponent } from './record/record-pro-train/record-pro-train-item/record-pro-train-item.component';
import { RecordProTrainFormComponent } from './record/record-pro-train/record-pro-train-form/record-pro-train-form.component';
import { RecordAccTrainComponent } from './record/record-acc-train/record-acc-train.component';
import { RecordAccTrainItemComponent } from './record/record-acc-train/record-acc-train-item/record-acc-train-item.component';
import { RecordAccTrainFormComponent } from './record/record-acc-train/record-acc-train-form/record-acc-train-form.component';
import { RecordLanguagesComponent } from './record/record-languages/record-languages.component';
import { RecordLanguagesItemComponent } from './record/record-languages/record-languages-item/record-languages-item.component';
import { RecordLanguagesFormComponent } from './record/record-languages/record-languages-form/record-languages-form.component';
import { CvComponent } from './cv/cv.component';
import { SimilarPagesComponent } from './RibComponents/similar-pages/similar-pages.component';
import { UserFriendsComponent } from './user/user-friends/user-friends.component';
import { UserFriendsItemComponent } from './user/user-friends/user-friends-item/user-friends-item.component';
// removed: @agm/core (archived; project used only AgmCoreModule.forRoot() — unreferenced in templates)
import { UserLinksComponent } from './user/user-links/user-links.component';
import { UserPortfolioComponent } from './user/user-portfolio/user-portfolio.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserViewCardComponent } from './user-view/user-view-card/user-view-card.component';
import { UserViewFriendsComponent } from './user-view/user-view-friends/user-view-friends.component';
import { UserViewFriendsItemComponent } from './user-view/user-view-friends/user-view-friends-item/user-view-friends-item.component';
import { DemonstrateComponent } from './demonstrate/demonstrate.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { DemonstrateDashboardComponent } from './demonstrate/demonstrate-dashboard/demonstrate-dashboard.component';
import { DemonstrateSuggestionComponent } from './demonstrate/demonstrate-suggestion/demonstrate-suggestion.component';
import { DemonstrateFormComponent } from './demonstrate/demonstrate-form/demonstrate-form.component';
import { DemonstrateListeComponent } from './demonstrate/demonstrate-liste/demonstrate-liste.component';
import { DemonstrateItemComponent } from './demonstrate/demonstrate-liste/demonstrate-item/demonstrate-item.component';
import { EvaluateListComponent } from './evaluate/evaluate-list/evaluate-list.component';
import { EvaluateSuggestionComponent } from './evaluate/evaluate-suggestion/evaluate-suggestion.component';
import { EvaluateOwnerComponent } from './evaluate/evaluate-owner/evaluate-owner.component';
import { EvaluateItemComponent } from './evaluate/evaluate-list/evaluate-item/evaluate-item.component';
import { EvaluateFormComponent } from './evaluate/evaluate-form/evaluate-form.component';
import { ParticipateToChallengeComponent } from './evaluate/evaluate-list/participate-to-challenge/participate-to-challenge.component';
import { MaintenanceComponent } from './RibComponents/maintenance/maintenance.component';
import { PolicyComponent } from './RibComponents/policy/policy.component';
import { PricingComponent } from './RibComponents/pricing/pricing.component';
import { TermsComponent } from './RibComponents/terms/terms.component';
import { OrganisationAboutComponent } from './organisation/organisation-about/organisation-about.component';
import { OrganisationCertificationComponent } from './organisation/organisation-certification/organisation-certification.component';
import { OrganisationJobsComponent } from './organisation/organisation-jobs/organisation-jobs.component';
import { OrganisationLinksComponent } from './organisation/organisation-links/organisation-links.component';
import { OrganisationPostComponent } from './organisation/organisation-post/organisation-post.component';
import { OrganisationSettingsComponent } from './organisation/organisation-settings/organisation-settings.component';
import { OrganisationViewComponent } from './organisation-view/organisation-view.component';
import { OrganisationViewCertifComponent } from './organisation-view/organisation-view-certif/organisation-view-certif.component';
import { OrganisationViewJobsComponent } from './organisation-view/organisation-view-jobs/organisation-view-jobs.component';
import { CreateOrganisationComponent } from './create-organisation/create-organisation.component';
import { FriendsComponent } from './user/friends/friends.component';
import { FriendsItemComponent } from './user/friends/friends-item/friends-item.component';
import { OrganisationCertAprouvedItemComponent } from './organisation/organisation-certification/organisation-certification-approuved/organisation-cert-aprouved-item/organisation-cert-aprouved-item.component';
import { OrganisationCertificationAskedComponent } from './organisation/organisation-certification/organisation-certification-asked/organisation-certification-asked.component';
import { OrganisationJobsItemComponent } from './organisation/organisation-jobs/organisation-jobs-item/organisation-jobs-item.component';
import { OrganisationPostItemComponent } from './organisation/organisation-post/organisation-post-item/organisation-post-item.component';
import { OrganisationViewCertifItemComponent } from './organisation-view/organisation-view-certif/organisation-view-certif-item/organisation-view-certif-item.component';
import { OrganisationCertAskedItemComponent } from './organisation/organisation-certification/organisation-certification-asked/organisation-cert-asked-item/organisation-cert-asked-item.component';
import { OrganisationViewJobsItemComponent } from './organisation-view/organisation-view-jobs/organisation-view-jobs-item/organisation-view-jobs-item.component';
import { OrganisationCertificationApprouvedComponent } from './organisation/organisation-certification/organisation-certification-approuved/organisation-certification-approuved.component';
import { UserPostComponent } from './user/user-post/user-post.component';
import { UserPostItemComponent } from './user/user-post/user-post-item/user-post-item.component';
import { ContactComponent } from './RibComponents/contact/contact.component';
import { JobProfileComponent } from './job-profile/job-profile.component';
import { OrgJobProfileComponent } from './job-profile/org-job-profile/org-job-profile.component';
import { UserJobProfileComponent } from './job-profile/user-job-profile/user-job-profile.component';
import { SimilarJobsComponent } from './RibComponents/similar-jobs/similar-jobs.component';
import { JobsPostComponent } from './jobs/jobs-post/jobs-post.component';
import { JobsPostFormComponent } from './jobs/jobs-post/jobs-post-form/jobs-post-form.component';
import { JobStep1Component } from './jobs/jobs-post/job-step1/job-step1.component';
import { JobStep2Component } from './jobs/jobs-post/job-step2/job-step2.component';
import { JobStep3Component } from './jobs/jobs-post/job-step3/job-step3.component';
import { JobStep4Component } from './jobs/jobs-post/job-step4/job-step4.component';
import { JobStep5Component } from './jobs/jobs-post/job-step5/job-step5.component';
import { PostCommentsComponent } from './feed/post/post-comments/post-comments.component';
import { PostCommentsFormComponent } from './feed/post/post-comments-form/post-comments-form.component';
import { PostCommentsItemComponent } from './feed/post/post-comments-item/post-comments-item.component';
import { PostLocationComponent } from './feed/post/post-form/post-location/post-location.component';
import { ScrollableDirective } from './directives/scrollable.directive';
import { PostListComponent } from './feed/post/post-list/post-list.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PaginationService } from './shared/services/pagination.service';
import { PostService } from './shared/services/post.service';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// removed: MatGoogleMapsAutocompleteModule — pulls Angular Material 9 which can't be bumped
import { IdentifiedUsersComponent } from './feed/post/post-form/post-identify/identified-users/identified-users.component';
import { IdentifiedUsersItemComponent } from './feed/post/post-form/post-identify/identified-users/identified-users-item/identified-users-item.component';
import { IdentifiedUsersListComponent } from './feed/post/post-form/post-identify/identified-users/identified-users-list/identified-users-list.component';
import { PostIdentifyComponent } from './feed/post/post-form/post-identify/post-identify.component';
import {NgbModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
// removed: @kolkov/angular-editor — imports DOCUMENT from @angular/core which
// was moved to @angular/common in v16. All known 3.x releases have this issue.
// Replace the 2 <angular-editor> usages with plain <textarea> or migrate to a
// maintained rich-text editor (e.g. @ngneat/edit-in-place) later.
import { IncitationItemComponent } from './incitations/incitation-item/incitation-item.component';
import { TagsComponent } from './RibComponents/tags/tags.component';
import { RateComponent } from './RibComponents/rate/rate.component';
import { PostShareComponent } from './feed/post/post-share/post-share.component';
import { FriendsListComponent } from './user/friends/friends-list/friends-list.component';
import { FriendSuggestionComponent } from './user/friends/friend-suggestion/friend-suggestion.component';
import { FriendSuggestionItemComponent } from './user/friends/friend-suggestion/friend-suggestion-item/friend-suggestion-item.component';
import { FriendInvitationComponent } from './user/friends/friend-invitation/friend-invitation.component';
import { FriendInvitationItemComponent } from './user/friends/friend-invitation/friend-invitation-item/friend-invitation-item.component';
import { InitchatComponent } from './RibComponents/initchat/initchat.component';
import { PostShareFormComponent } from './feed/post/post-share/post-share-form/post-share-form.component';
import { PostShareItemComponent } from './feed/post/post-share/post-share-item/post-share-item.component';
import { JobsItemComponent } from './jobs/jobs-item/jobs-item.component';
import { JobsCreatedComponent } from './jobs/jobs-created/jobs-created.component';
import { JobsSavedComponent } from './jobs/jobs-saved/jobs-saved.component';
import { JobsAppliedComponent } from './jobs/jobs-applied/jobs-applied.component';
import { CountdownModule } from 'ngx-countdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgxUiLoaderModule, NgxUiLoaderRouterModule} from 'ngx-ui-loader';
import { JobsAppliedItemComponent } from './jobs/jobs-applied/jobs-applied-item/jobs-applied-item.component';
import { JobsAppliedDetailsComponent } from './jobs/jobs-applied/jobs-applied-details/jobs-applied-details.component';
import { RecordRealisationComponent } from './record/record-realisation/record-realisation.component';
import { RecordRealisationDetailsComponent } from './record/record-realisation/record-realisation-item/record-realisation-details/record-realisation-details.component';
import { RecordRealisationFormComponent } from './record/record-realisation/record-realisation-form/record-realisation-form.component';
import { RecordRealisationItemComponent } from './record/record-realisation/record-realisation-item/record-realisation-item.component';
import { DocumentComponent } from './document/document.component';
import { RealisationComponent } from './realisation/realisation.component';
import { UserslistInlineComponent } from './users/userslist-inline/userslist-inline.component';
import { UserslistInlineItemComponent } from './users/userslist-inline-item/userslist-inline-item.component';
import { JobProcessComponent } from './job-profile/job-process/job-process.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FollowOrgsComponent } from './RibComponents/follow-orgs/follow-orgs.component';
import { SearchComponent } from './search/search.component';
import { NotfoundComponent } from './RibComponents/notfound/notfound.component';
import { VideosComponent } from './RibComponents/videos/videos.component';
import { ChatContentComponent } from './chat/chat-content/chat-content.component';
import { ChatImgComponent } from './chat/chat-img/chat-img.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';
import { ChatroomComponent } from './chat/chatroom/chatroom.component';
import { InitiatechatComponent } from './chat/initiatechat/initiatechat.component';
import { MessageItemComponent } from './chat/message-item/message-item.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RecordDocumentsComponent } from './record-documents/record-documents.component';
import { RecordDocumentItemComponent } from './record-documents/record-document-item/record-document-item.component';
import { RecordDocumentFormComponent } from './record-documents/record-document-form/record-document-form.component';
import { UploadFileComponent } from './RibComponents/upload-file/upload-file.component';
import { DndDirective } from './RibComponents/upload-file/dnd.directive';
import { RequiresProDirective } from './shared/directives/requires-pro.directive';
import { ProfileCompletenessComponent } from './shared/components/profile-completeness/profile-completeness.component';
import { UpgradeModalComponent } from './shared/components/upgrade-modal/upgrade-modal.component';
import { ReferralWidgetComponent } from './shared/components/referral-widget/referral-widget.component';
// BadgePageComponent is standalone + lazy-loaded
import { AdminSeedComponent } from './admin-seed/admin-seed.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserResolverComponent } from './user-resolver/user-resolver.component';
// StarProfileComponent + AiCoachComponent are standalone + lazy-loaded
import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component';
import { UniversityDashboardComponent } from './university-dashboard/university-dashboard.component';
// OnboardComponent is standalone + lazy-loaded
import { AdminChallengesComponent } from './admin-challenges/admin-challenges.component';
// SponsorChallengeComponent is standalone + lazy-loaded

// V5 UI kit — global icon registration for lucide-angular. All Richblok
// <rb-icon name="…"> uses must have their name listed here. Unregistered
// names log a GlobalErrorHandler warning at render time.
import {
  LucideAngularModule,
  Settings, Target, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Clock, ArrowUp, ArrowRight, ArrowDown, ArrowLeft,
  Check, CheckCircle, X, XCircle, Plus, Minus, Search,
  Bell, User, Users, Bot, Sparkles, PartyPopper,
  Clipboard, ClipboardCopy, Copy, ExternalLink, Link as LinkIcon,
  Share2, Download, Upload,
  FileText, File, Image as ImageIcon, Mail,
  MessageSquare, MessageCircle,
  Eye, EyeOff, Lock, Unlock, Shield, ShieldCheck,
  Award, Trophy, Star, Briefcase, Calendar, Home,
  Menu, MoreVertical, MoreHorizontal,
  Edit, Edit2, Edit3, Trash, Trash2,
  Filter, Info, AlertCircle, AlertTriangle, HelpCircle,
  Tag, Zap, TrendingUp, BarChart, BarChart2,
  LogOut, LogIn, RefreshCw, Loader,
  Facebook, Twitter, Linkedin, Github,
} from 'lucide-angular';

@NgModule({
  declarations: [
    DndDirective,
    AppComponent,
    LoginComponent,
    ResetComponent,
    SignupComponent,
    PostItemComponent,
    PostFormComponent,
    RecordComponent,
    RecordFormComponent,
    VerifyEmailComponent,
    TrainingsComponent,
    TrainingFormComponent,
    TrainingItemComponent,
    ExperiencesComponent,
    ExperiencesFormComponent,
    ExperiencesItemComponent,
    SkillsComponent,
    SkillDetailedFormComponent,
    SkillFormComponent,
    SkillItemComponent,
    DocumentsComponent,
    DocumentFormComponent,
    DocumentItemComponent,
    UserComponent,
    UserPublicProfilComponent,
    UserSettingsComponent,
    ArchiveItemComponent,
    CertifyItemComponent,
    OrganisationComponent,
    OrganisationProfileComponent,
    OrganisationsListComponent,
    UserCardComponent,
    HeaderComponent,
    UserAboutComponent,
    LandingTestimanialsComponent,
    PremiumComponent,
    ConnectionAsideComponent,
    ConnectionAsideItemComponent,
    JobAsideComponent,
    JobAsideItemComponent,
    RibSolutionsComponent,
    ViewedProfileComponent,
    ViewedProfileItemComponent,
    JobsComponent,
    FooterComponent,
    ChatComponent,
    NotificationsComponent,
    NotificationsItemsComponent,
    PostItemDetailComponent,
    RecordSkillsComponent,
    RecordSkillsItemComponent,
    RecordSkillsFormComponent,
    RecordExperiencesComponent,
    RecordExperiencesItemComponent,
    RecordExperiencesFormComponent,
    RecordProTrainComponent,
    RecordProTrainItemComponent,
    RecordProTrainFormComponent,
    RecordAccTrainComponent,
    RecordAccTrainItemComponent,
    RecordAccTrainFormComponent,
    RecordLanguagesComponent,
    RecordLanguagesItemComponent,
    RecordLanguagesFormComponent,
    CvComponent,
    SimilarPagesComponent,
    UserFriendsComponent,
    UserFriendsItemComponent,
    UserLinksComponent,
    UserPortfolioComponent,
    UserViewComponent,
    UserViewCardComponent,
    UserViewFriendsComponent,
    UserViewFriendsItemComponent,
    DemonstrateComponent,
    EvaluateComponent,
    DemonstrateDashboardComponent,
    DemonstrateSuggestionComponent,
    DemonstrateFormComponent,
    DemonstrateListeComponent,
    DemonstrateItemComponent,
    EvaluateListComponent,
    EvaluateSuggestionComponent,
    EvaluateOwnerComponent,
    EvaluateItemComponent,
    EvaluateFormComponent,
    ParticipateToChallengeComponent,
    MaintenanceComponent,
    PolicyComponent,
    PricingComponent,
    TermsComponent,
    OrganisationAboutComponent,
    OrganisationCertificationComponent,
    OrganisationJobsComponent,
    OrganisationLinksComponent,
    OrganisationPostComponent,
    OrganisationSettingsComponent,
    OrganisationViewComponent,
    OrganisationViewCertifComponent,
    OrganisationViewJobsComponent,
    CreateOrganisationComponent,
    FriendsComponent,
    FriendsItemComponent,
    OrganisationCertAprouvedItemComponent,
    OrganisationCertificationAskedComponent,
    OrganisationJobsItemComponent,
    OrganisationPostItemComponent,
    OrganisationViewCertifItemComponent,
    OrganisationCertAskedItemComponent,
    OrganisationViewJobsItemComponent,
    OrganisationCertificationApprouvedComponent,
    UserPostComponent,
    UserPostItemComponent,
    ContactComponent,
    JobProfileComponent,
    OrgJobProfileComponent,
    UserJobProfileComponent,
    SimilarJobsComponent,
    JobsPostComponent,
    JobsPostFormComponent,
    JobStep1Component,
    JobStep2Component,
    JobStep3Component,
    JobStep4Component,
    JobStep5Component,
    PostCommentsComponent,
    PostCommentsFormComponent,
    PostCommentsItemComponent,
    PostLocationComponent,
    ScrollableDirective,
    PostListComponent,
    LoadingSpinnerComponent,
    IdentifiedUsersComponent,
    IdentifiedUsersItemComponent,
    IdentifiedUsersListComponent,
    PostIdentifyComponent,
    IncitationItemComponent,
    TagsComponent,
    RateComponent,
    PostShareComponent,
    FriendsListComponent,
    FriendSuggestionComponent,
    FriendSuggestionItemComponent,
    FriendInvitationComponent,
    FriendInvitationItemComponent,
    InitchatComponent,
    PostShareFormComponent,
    PostShareItemComponent,
    JobsItemComponent,
    JobsCreatedComponent,
    JobsSavedComponent,
    JobsAppliedComponent,
    JobsAppliedItemComponent,
    JobsAppliedDetailsComponent,
    RecordRealisationComponent,
    RecordRealisationDetailsComponent,
    RecordRealisationFormComponent,
    RecordRealisationItemComponent,
    ParticipateToChallengeComponent,
    RecordExperiencesFormComponent,
    CvComponent,
    DocumentComponent,
    OrganisationAboutComponent,
    OrganisationProfileComponent,
    OrganisationSettingsComponent,
    RealisationComponent,
    RecordRealisationItemComponent,
    UserslistInlineComponent,
    UserslistInlineItemComponent,
    JobProcessComponent,
    FollowOrgsComponent,
    SearchComponent,
    NotfoundComponent,
    VideosComponent,
    ChatContentComponent,
    ChatImgComponent,
    ChatListComponent,
    ChatroomComponent,
    InitiatechatComponent,
    MessageItemComponent,
    RecordDocumentFormComponent,
    RecordDocumentItemComponent,
    RecordDocumentsComponent,
    UploadFileComponent,
    ProgressComponent,
    RequiresProDirective,
    ProfileCompletenessComponent,
    UpgradeModalComponent,
    ReferralWidgetComponent,
    AdminSeedComponent,
    AdminDashboardComponent,
    UserResolverComponent,
    EmployerDashboardComponent,
    UniversityDashboardComponent,
    AdminChallengesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'richblok-app' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    NgbTimepickerModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule.forRoot({ showForeground: true }),
    CountdownModule,
    PdfViewerModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: typeof window !== 'undefined' && (window as any).location.hostname !== 'localhost'
    }),

    // V5 UI kit — global Lucide icon registration. Standalone <rb-icon>
    // components in any lazy chunk can render any of these by name.
    LucideAngularModule.pick({
      Settings, Target, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
      Clock, ArrowUp, ArrowRight, ArrowDown, ArrowLeft,
      Check, CheckCircle, X, XCircle, Plus, Minus, Search,
      Bell, User, Users, Bot, Sparkles, PartyPopper,
      Clipboard, ClipboardCopy, Copy, ExternalLink, LinkIcon,
      Share2, Download, Upload,
      FileText, File, ImageIcon, Mail,
      MessageSquare, MessageCircle,
      Eye, EyeOff, Lock, Unlock, Shield, ShieldCheck,
      Award, Trophy, Star, Briefcase, Calendar, Home,
      Menu, MoreVertical, MoreHorizontal,
      Edit, Edit2, Edit3, Trash, Trash2,
      Filter, Info, AlertCircle, AlertTriangle, HelpCircle,
      Tag, Zap, TrendingUp, BarChart, BarChart2,
      LogOut, LogIn, RefreshCw, Loader,
      Facebook, Twitter, Linkedin, Github,
    }),

  ],
  providers: [
    ApiService,
    PostService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }

