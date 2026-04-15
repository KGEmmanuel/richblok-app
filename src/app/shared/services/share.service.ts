import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

export interface ShareablePayload {
  url: string;
  title?: string;
  text?: string;
  context?: string;  // e.g. 'badge', 'profile', 'referral'
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private analytics: AnalyticsService) {}

  shareToWhatsApp(payload: ShareablePayload): void {
    const text = this.buildText(payload);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    this.analytics.track('Share', { channel: 'whatsapp', context: payload.context });
    this.openWindow(url);
  }

  shareToTwitter(payload: ShareablePayload): void {
    const text = payload.text || payload.title || '';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(payload.url)}`;
    this.analytics.track('Share', { channel: 'twitter', context: payload.context });
    this.openWindow(url);
  }

  shareToLinkedIn(payload: ShareablePayload): void {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(payload.url)}`;
    this.analytics.track('Share', { channel: 'linkedin', context: payload.context });
    this.openWindow(url);
  }

  /** Native share sheet on mobile if available; falls back to copy. */
  async shareNative(payload: ShareablePayload): Promise<boolean> {
    const nav: any = typeof navigator !== 'undefined' ? navigator : null;
    if (nav && typeof nav.share === 'function') {
      try {
        await nav.share({
          title: payload.title || 'Richblok',
          text: payload.text,
          url: payload.url
        });
        this.analytics.track('Share', { channel: 'native', context: payload.context });
        return true;
      } catch {
        return false; // user cancelled
      }
    }
    return this.copyLink(payload);
  }

  async copyLink(payload: ShareablePayload): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).clipboard) {
        await (navigator as any).clipboard.writeText(payload.url);
        this.analytics.track('Share', { channel: 'copy', context: payload.context });
        return true;
      }
    } catch { /* ignore */ }
    // Fallback for old browsers
    try {
      const ta = document.createElement('textarea');
      ta.value = payload.url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.analytics.track('Share', { channel: 'copy-fallback', context: payload.context });
      return true;
    } catch {
      return false;
    }
  }

  private buildText(p: ShareablePayload): string {
    const parts = [p.text || p.title, p.url].filter(Boolean);
    return parts.join('\n\n');
  }

  private openWindow(url: string): void {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
