import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase/app';
import 'firebase/analytics';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector, private zone: NgZone) {}

  handleError(error: any): void {
    const message = (error && error.message) || 'An unexpected error occurred';
    const stack = error && error.stack;

    // eslint-disable-next-line no-console
    console.error('GlobalErrorHandler:', error);

    // Log to Firebase Analytics if available
    try {
      const analytics = (firebase as any).analytics ? (firebase as any).analytics() : null;
      if (analytics && typeof analytics.logEvent === 'function') {
        analytics.logEvent('exception', {
          description: message,
          fatal: false,
          stack: stack ? stack.substring(0, 500) : undefined,
          url: typeof window !== 'undefined' ? window.location.href : ''
        });
      }
    } catch (e) {
      // analytics not initialized — silent
    }

    // Show user-friendly toast (only for non-network/non-cancellation errors)
    if (this.shouldNotifyUser(error)) {
      this.zone.run(() => {
        try {
          const toastr = this.injector.get(ToastrService);
          toastr.error(this.userFriendlyMessage(error), 'Something went wrong', {
            timeOut: 5000,
            closeButton: true
          });
        } catch (e) {
          // Toastr not available — silent
        }
      });
    }
  }

  private shouldNotifyUser(error: any): boolean {
    if (!error) { return false; }
    const msg = (error.message || '').toLowerCase();
    // Skip noisy Firestore / RxJS internal errors
    if (msg.includes('expressionchangedafterithasbeencheckederror')) { return false; }
    if (msg.includes('canceled') || msg.includes('cancelled')) { return false; }
    if (msg.includes('chunk') && msg.includes('failed')) {
      // Stale chunk after deploy — suggest reload
      return true;
    }
    return true;
  }

  private userFriendlyMessage(error: any): string {
    const msg = (error && error.message) || '';
    if (msg.includes('chunk') && msg.includes('failed')) {
      return 'A new version is available. Please refresh the page.';
    }
    if (msg.includes('permission-denied')) {
      return 'You don\'t have permission to perform this action.';
    }
    if (msg.includes('unauthenticated') || msg.includes('not-authorized')) {
      return 'Your session expired. Please sign in again.';
    }
    if (msg.includes('network') || msg.includes('failed to fetch')) {
      return 'Network connection issue. Please check your internet.';
    }
    return msg.length > 0 && msg.length < 200 ? msg : 'An unexpected error occurred. Please try again.';
  }
}
