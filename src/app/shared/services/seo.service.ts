import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'profile' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  author?: string;
  keywords?: string[];
}

const DEFAULTS: Required<Omit<SeoTags, 'keywords' | 'author'>> & { keywords: string[]; author: string } = {
  title: 'RichBlok — Verified Skills, Hired Globally',
  description: 'Get hired globally by proving your skills — not just listing them. RichBlok verifies your coding, design, and professional skills through live challenges, so recruiters trust your profile from day one.',
  image: 'https://richblok-app-production-86b6.up.railway.app/assets/og-image.png',
  url: 'https://richblok-app-production-86b6.up.railway.app',
  type: 'website',
  twitterCard: 'summary_large_image',
  author: 'RichBlok',
  keywords: ['skills verification', 'tech talent', 'African developers', 'hire developers', 'remote jobs', 'professional network', 'coding challenges']
};

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private titleSvc: Title, private meta: Meta) {}

  /**
   * Sets all SEO meta tags for the current page.
   * Pass only the fields you want to override; others fall back to defaults.
   */
  setTags(tags: SeoTags = {}): void {
    const merged = {
      title: tags.title || DEFAULTS.title,
      description: tags.description || DEFAULTS.description,
      image: tags.image || DEFAULTS.image,
      url: tags.url || DEFAULTS.url,
      type: tags.type || DEFAULTS.type,
      twitterCard: tags.twitterCard || DEFAULTS.twitterCard,
      author: tags.author || DEFAULTS.author,
      keywords: tags.keywords || DEFAULTS.keywords
    };

    // Standard tags
    this.titleSvc.setTitle(merged.title);
    this.upsert('name', 'description', merged.description);
    this.upsert('name', 'keywords', merged.keywords.join(', '));
    this.upsert('name', 'author', merged.author);

    // Open Graph (Facebook, LinkedIn)
    this.upsert('property', 'og:title', merged.title);
    this.upsert('property', 'og:description', merged.description);
    this.upsert('property', 'og:image', merged.image);
    this.upsert('property', 'og:url', merged.url);
    this.upsert('property', 'og:type', merged.type);
    this.upsert('property', 'og:site_name', 'RichBlok');

    // Twitter Card
    this.upsert('name', 'twitter:card', merged.twitterCard);
    this.upsert('name', 'twitter:title', merged.title);
    this.upsert('name', 'twitter:description', merged.description);
    this.upsert('name', 'twitter:image', merged.image);
  }

  /**
   * Convenience helper for user profile pages.
   */
  setProfileTags(user: { nom?: string; prenom?: string; accroche?: string; imageprofil?: string; lieu?: string }, profileId: string): void {
    const fullName = [user.prenom, user.nom].filter(Boolean).join(' ').trim() || 'RichBlok Member';
    const title = `${fullName} — Verified Profile on RichBlok`;
    const description = user.accroche
      ? `${fullName}: ${user.accroche.substring(0, 140)}`
      : `View ${fullName}'s verified skills, certifications, and challenge results on RichBlok.`;

    this.setTags({
      title,
      description,
      image: user.imageprofil,
      url: `https://richblok-app-production-86b6.up.railway.app/profile/${profileId}`,
      type: 'profile',
      author: fullName
    });
  }

  /**
   * Convenience helper for job posting pages.
   */
  setJobTags(job: { title?: string; description?: string; company?: string; location?: string }, jobId: string): void {
    const title = job.title ? `${job.title}${job.company ? ' at ' + job.company : ''} — RichBlok Jobs` : 'Job Opportunity — RichBlok';
    const description = job.description
      ? job.description.substring(0, 160)
      : `Apply for ${job.title} on RichBlok. Verified candidates only.`;

    this.setTags({
      title,
      description,
      url: `https://richblok-app-production-86b6.up.railway.app/job-profile/${jobId}`,
      type: 'article'
    });
  }

  /**
   * Reset to default site-wide tags (call on landing/home).
   */
  reset(): void {
    this.setTags();
  }

  private upsert(attr: 'name' | 'property', key: string, value: string): void {
    if (!value) { return; }
    const selector = `${attr}="${key}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: key, content: value });
    } else {
      this.meta.addTag({ [attr]: key, content: value });
    }
  }
}
