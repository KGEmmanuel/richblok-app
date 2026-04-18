import { Component, OnInit } from '@angular/core';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { OffreEmploiService } from 'src/app/shared/services/offre-emploi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

/**
 * Week 4 — Job-posting wizard.
 *
 * Previously the 5 steps lived on 5 sibling routes (/post-job-step-one..five)
 * with /post-jobs acting as a passive landing page that navigated out. That
 * was confusing: browser-back left users stranded between steps, deep links
 * were ambiguous, and each step had to rehydrate state from Firestore on
 * every transition.
 *
 * Now /post-jobs is the ONLY entry point. Internal `step` state drives which
 * child step component is rendered. The 5 step components remain (each
 * already owns its form + Firestore read logic), but their templates are
 * stripped of the shared header/footer chrome — the wizard shell owns that.
 *
 * Back-compat: /post-jobs/:id continues to work (matrix-param style, same as
 * before). Any code that was calling `router.navigate(['post-job-step-one'])`
 * or similar should now navigate to /post-jobs and let the wizard pick the
 * step. Those deep-link routes have been removed from app-routing.module.ts.
 */
@Component({
  selector: 'app-jobs-post',
  templateUrl: './jobs-post.component.html',
  styleUrls: ['./jobs-post.component.scss']
})
export class JobsPostComponent implements OnInit {
  currentJob: OffresEmploi = new OffresEmploi();
  jobId: string | null = null;
  /** 1..5. Defaults to the latest unlocked step or 1 for a new draft. */
  step = 1;

  readonly steps: Array<{ n: number; title: string; blurb: string }> = [
    { n: 1, title: 'Job offer',   blurb: 'Post the job, set criteria, pre-interview, challenges.' },
    { n: 2, title: 'Sorting',     blurb: 'AI-sort candidates. Prepare pre-interviews.' },
    { n: 3, title: 'Scoring',     blurb: 'Score pre-interviews, salary, final-interview invites.' },
    { n: 4, title: 'Purposes',    blurb: 'Run final interviews + transmit process report.' },
    { n: 5, title: 'Recruit',     blurb: 'Send certified offer + smart contract to the selected candidate.' },
  ];

  constructor(
    private jobSvc: OffreEmploiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrSvc: ToastrService,
    private loadingSvc: NgxUiLoaderService
  ) { }

  ngOnInit() {
    // /post-jobs with no id = new draft, start at step 1.
    // /post-jobs/:id = edit existing draft, jump to the latest unlocked step.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobSvc.getDocRef(id).onSnapshot(sn => {
        if (sn && sn.data()) {
          this.currentJob = sn.data() as OffresEmploi;
          this.currentJob.id = sn.id;
          this.jobId = sn.id;
          // Seed wizard step from the draft's `currentStep`. Fallback to 1.
          const fromDraft = Math.max(1, Math.min(5, Number(this.currentJob.currentStep) || 1));
          // Only seed once, on the initial snapshot — don't yank users around
          // when Firestore live-updates currentStep out from under them.
          if (this.step === 1) { this.step = fromDraft; }
        } else {
          this.toastrSvc.error('Unable to find selected Job offer');
          this.currentJob = new OffresEmploi();
          this.jobId = null;
        }
      });
    }
  }

  /**
   * Jump to step `n`. Gated by the draft's `currentStep`: you can revisit
   * any step up to (and including) the latest one you've unlocked, but
   * you can't skip ahead to an unreached step.
   */
  goToStep(n: number) {
    if (n < 1 || n > 5) { return; }
    const cap = Math.max(1, Number(this.currentJob?.currentStep) || 1);
    if (n > cap) {
      this.toastrSvc.info('Finish the current step before jumping ahead.', 'Locked');
      return;
    }
    this.step = n;
  }

  /**
   * Close the current step server-side (increments `currentStep` in Firestore
   * via `jobSvc.closeStep`) and advance the wizard UI one step forward.
   */
  advance() {
    if (!this.jobId) {
      this.toastrSvc.error('Save the job draft first.', 'Nothing to advance');
      return;
    }
    this.loadingSvc.start();
    const closedStep = this.currentJob.currentStep;
    this.jobSvc.closeStep(this.currentJob).then(() => {
      this.toastrSvc.success(
        'Step ' + closedStep + ' closed. You can now proceed to the next step.',
        'Step saved'
      );
      if (this.step < 5) { this.step += 1; }
    }).catch(err => {
      this.toastrSvc.error('Could not close step: ' + (err?.message || err));
    }).finally(() => {
      this.loadingSvc.stop();
    });
  }

  stepUnlocked(n: number): boolean {
    const cap = Math.max(1, Number(this.currentJob?.currentStep) || 1);
    return n <= cap;
  }

  stepIsCurrent(n: number): boolean {
    return this.step === n;
  }
}
