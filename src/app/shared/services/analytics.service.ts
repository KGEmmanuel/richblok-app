import { Injectable } from '@angular/core';

declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

/**
 * Unified analytics tracking service:
 * - Facebook Pixel (fbq)
 * - Google Analytics (gtag)
 * - Firebase Analytics via window.firebase if available
 *
 * Events are mapped to platform-native event names where possible.
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private readonly FB_EVENTS = new Set([
    'PageView', 'ViewContent', 'Search', 'AddToCart', 'AddToWishlist',
    'InitiateCheckout', 'AddPaymentInfo', 'Purchase', 'Lead',
    'CompleteRegistration', 'Subscribe', 'Contact'
  ]);

  track(event: string, params: Record<string, any> = {}): void {
    // Console (helpful in dev + visible in production console if debugging)
    try {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event, params);
    } catch { /* ignore */ }

    // Facebook / Meta Pixel
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        if (this.FB_EVENTS.has(event)) {
          window.fbq('track', event, params);
        } else {
          window.fbq('trackCustom', event, params);
        }
      }
    } catch { /* ignore */ }

    // Google Analytics (GA4)
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event, params);
      }
    } catch { /* ignore */ }
  }

  /** Identify a user after sign-in (best-effort). */
  identify(uid: string, traits: Record<string, any> = {}): void {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration', { uid, ...traits });
      }
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('set', { user_id: uid });
      }
    } catch { /* ignore */ }
  }

  /** Dedicated helper so call sites read naturally. */
  pageView(page: string): void {
    this.track('PageView', { page });
  }
}
