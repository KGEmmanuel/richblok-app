import { Title, Meta } from '@angular/platform-browser';
import { UtilisateurService } from './../shared/services/utilisateur.service';
import { SeoService } from './../shared/services/seo.service';
import { AnalyticsService } from './../shared/services/analytics.service';
import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
// D7 Day 2 Batch B — modular Firestore + Auth. No more firebase/compat/app import.
import { Firestore, collection, getCountFromServer } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';

type Lang = 'en' | 'fr';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  email: string;
  annualBilling = false;
  badgeCount = 0;
  lang: Lang = 'en';
  faqOpen: { [k: number]: boolean } = {};

  readonly strings: Record<Lang, Record<string, string | string[]>> = {
    en: {
      nav_login: 'Sign in',
      nav_signup: 'Get started',
      // 2026 repositioning — lead with AI-native verification. CV-to-STAR stays
      // below the fold as a secondary path (see how_2b_*).
      hero_title: 'Verified AI-native engineers.',
      hero_accent: 'Real PRs, scored by Claude, in 45 minutes.',
      hero_sub: 'Ship a real fix with any AI tool you use — Claude Code, Cursor, Copilot, Windsurf. Richblok scores your PR + transcript + explainer on correctness, verification discipline, and cost consciousness. Employers hiring globally see exactly how you collaborate with AI.',
      hero_cta: 'Earn your first AI-native badge',
      hero_cta_sub: 'Pick a 45-min challenge · any AI tool · public verified badge',
      hero_note: 'Free to earn. No card. Your transcript is private. Badge URL is public.',
      counter_prefix: 'AI-native badges earned this week',
      how_title: 'Credentials that survive contact with hiring managers.',
      how_1_title: 'Take an AI-pair challenge',
      how_1_desc: 'Pick one of 4 broken-repo challenges. 45 minutes. Use Claude Code, Cursor, GitHub Copilot — whichever you actually use at work. We track which tool, we don\'t restrict it.',
      how_2_title: 'Ship a real PR + transcript',
      how_2_desc: 'Submit your unified diff + full AI conversation. Our scorer reads both: did you catch the AI\'s mistakes? Did you push back? Did you burn tokens on "please fix this" prompts? The rubric is public.',
      how_3_title: 'Get discovered on /ai-native',
      how_3_desc: 'Pass the challenge → badge goes to the public directory ranked by verification score. Employers filtering for "verified AI-native" find your profile — and your GitHub, and your STAR stories — in one click.',
      trust_title: 'Trusted across Africa',
      trust_sub: 'Developers shipping badges from',
      pricing_title: 'Less than 2 cups of coffee',
      pricing_sub: 'Free to start. Upgrade when you need unlimited proof.',
      pricing_free: 'Free',
      pricing_free_price: '$0',
      pricing_free_period: 'forever',
      pricing_free_feat: ['3 challenges per month', 'Public profile page', 'Shareable badge URLs', 'Basic recruiter visibility'],
      pricing_pro: 'Pro',
      pricing_pro_price_monthly: '$10',
      pricing_pro_price_annual: '$7',
      pricing_pro_period_monthly: '/month',
      pricing_pro_period_annual: '/month, billed yearly',
      pricing_pro_feat: ['Unlimited challenges', 'Verified Pro badge', 'Priority recruiter visibility', 'CV export (PDF)', 'Application tracking', 'Referral rewards'],
      pricing_pro_cta: 'Go Pro',
      pricing_annual: 'Save 30% — pay yearly',
      pricing_guarantee: '30-day money-back guarantee. Cancel anytime in one click.',
      faq_title: 'Quick answers',
      faq_1_q: 'How is this different from LinkedIn?',
      faq_1_a: 'LinkedIn trusts what you type. Richblok trusts what you prove. Every badge is earned from a timed, scored AI-pair challenge — not typed into a text field. Your PR diff, your transcript, your verification score are all public on your badge page.',
      faq_ai_q: 'Which AI tools are allowed?',
      faq_ai_a: 'Any tool you already use. Claude Code, Cursor, GitHub Copilot, Windsurf, Replit Agent, Codex, v0, Lovable, Bolt — we support declaring which one. We don\'t restrict, we measure. The skill we score is AI-collaboration, not tool brand.',
      faq_2_q: 'Do recruiters actually use this?',
      faq_2_a: 'Your badges have a public URL. Every time you share one on WhatsApp, LinkedIn, or Twitter, recruiters see a live, verified score they can click to validate.',
      faq_3_q: 'Can I use it on my phone?',
      faq_3_a: 'Yes — Richblok is mobile-first. Challenges, badges, and sharing all work beautifully on Android and iPhone, even on 3G.',
      faq_4_q: 'What payment methods work in Africa?',
      faq_4_a: 'Visa, Mastercard, Verve, and local bank cards via Stripe. Works in Nigeria, Kenya, Ghana, South Africa, Cameroon, Senegal, and 20+ more.',
      final_title: 'Ready to be provable?',
      final_sub: 'Pick an AI-pair challenge, ship a real PR in 45 minutes, earn a badge that ranks on /ai-native. Or upload your CV for AI-drafted STAR stories.',
      final_cta: 'Browse challenges',
      hero_secondary_cta: 'Or upload your CV for STAR stories →'
    },
    fr: {
      nav_login: 'Connexion',
      nav_signup: 'Commencer',
      hero_title: 'Ingénieurs AI-natifs vérifiés.',
      hero_accent: 'De vrais PR, notés par Claude, en 45 minutes.',
      hero_sub: 'Livrez un vrai correctif avec l\'outil IA que vous utilisez déjà — Claude Code, Cursor, Copilot, Windsurf. Richblok note votre PR + transcript + explication sur la justesse, la discipline de vérification, et la conscience des coûts. Les recruteurs voient exactement comment vous collaborez avec l\'IA.',
      hero_cta: 'Gagner mon premier badge AI-natif',
      hero_cta_sub: '45 min · n\'importe quel outil IA · badge vérifié public',
      hero_note: 'Gratuit. Sans carte. Votre transcript reste privé. L\'URL du badge est publique.',
      counter_prefix: 'badges AI-natifs gagnés cette semaine',
      how_title: 'Des crédentiaux qui résistent aux recruteurs.',
      how_1_title: 'Relevez un défi AI-pair',
      how_1_desc: 'Choisissez parmi 4 défis de repo cassé. 45 minutes. Utilisez Claude Code, Cursor, GitHub Copilot — ce que vous utilisez au travail. On suit l\'outil, on ne le restreint pas.',
      how_2_title: 'Livrez un vrai PR + transcript',
      how_2_desc: 'Soumettez votre diff unifié + la conversation complète avec l\'IA. Notre scoreur lit les deux : avez-vous repéré les erreurs de l\'IA ? Avez-vous poussé en arrière ? Avez-vous gaspillé des tokens sur « please fix this » ? Le barème est public.',
      how_3_title: 'Soyez découvert sur /ai-native',
      how_3_desc: 'Défi réussi → badge dans le répertoire public classé par score de vérification. Les recruteurs filtrant « AI-natif vérifié » trouvent votre profil — GitHub + histoires STAR inclus — en un clic.',
      trust_title: 'Utilisé à travers l’Afrique',
      trust_sub: 'Développeurs partageant des badges depuis',
      pricing_title: 'Moins de 2 cafés',
      pricing_sub: 'Gratuit pour commencer. Passez Pro quand il vous faut des preuves illimitées.',
      pricing_free: 'Gratuit',
      pricing_free_price: '0 $',
      pricing_free_period: 'pour toujours',
      pricing_free_feat: ['3 défis par mois', 'Page de profil publique', 'URLs de badge partageables', 'Visibilité recruteur de base'],
      pricing_pro: 'Pro',
      pricing_pro_price_monthly: '10 $',
      pricing_pro_price_annual: '7 $',
      pricing_pro_period_monthly: '/mois',
      pricing_pro_period_annual: '/mois, facturé à l’année',
      pricing_pro_feat: ['Défis illimités', 'Badge Pro vérifié', 'Priorité recruteur', 'Export CV (PDF)', 'Suivi des candidatures', 'Récompenses parrainage'],
      pricing_pro_cta: 'Passer Pro',
      pricing_annual: 'Économisez 30 % — annuel',
      pricing_guarantee: 'Satisfait ou remboursé 30 jours. Annulation en un clic.',
      faq_title: 'Réponses rapides',
      faq_1_q: 'En quoi est-ce différent de LinkedIn ?',
      faq_1_a: 'LinkedIn fait confiance à ce que vous tapez. Richblok fait confiance à ce que vous prouvez. Chaque badge est gagné sur un défi chronométré — pas déclaré dans un formulaire.',
      faq_2_q: 'Les recruteurs utilisent-ils vraiment ça ?',
      faq_2_a: 'Vos badges ont une URL publique. Chaque fois que vous la partagez sur WhatsApp, LinkedIn ou Twitter, les recruteurs voient un score vérifié qu’ils peuvent cliquer pour valider.',
      faq_3_q: 'Puis-je l’utiliser sur mon téléphone ?',
      faq_3_a: 'Oui — Richblok est conçu mobile-first. Défis, badges et partage fonctionnent parfaitement sur Android et iPhone, même en 3G.',
      faq_4_q: 'Quels moyens de paiement en Afrique ?',
      faq_4_a: 'Visa, Mastercard, Verve et cartes bancaires locales via Stripe. Fonctionne au Nigeria, Kenya, Ghana, Afrique du Sud, Cameroun, Sénégal, et 20+ autres pays.',
      final_title: 'Prêt à être prouvable ?',
      final_sub: 'Choisissez un défi AI-pair, livrez un vrai PR en 45 minutes, gagnez un badge qui apparaît sur /ai-native. Ou déposez votre CV pour des histoires STAR générées par IA.',
      final_cta: 'Parcourir les défis',
      hero_secondary_cta: 'Ou déposer mon CV pour des histoires STAR →'
    }
  };

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor(
    private router: Router,
    private userSvc: UtilisateurService,
    private title: Title,
    private meta: Meta,
    private seo: SeoService,
    private analytics: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get isBrowser(): boolean { return isPlatformBrowser(this.platformId); }

  ngOnInit() {
    this.seo.reset();
    this.detectLang();
    if (this.isBrowser) {
      this.analytics.track('PageView', { page: 'landing' });
      // MVP Sprint A — real social proof only. Counter pill hidden below the
      // reveal threshold instead of printing a fake seed value. The template
      // reads `badgeCount > MIN_SOCIAL_PROOF` before rendering the chip.
      // `getCountFromServer` is cheaper than `getDocs` (server returns count,
      // no doc bodies). firebase 9.23+ ships this symbol.
      getCountFromServer(collection(this.firestore, 'badges'))
        .then(snap => { this.badgeCount = snap.data().count || 0; })
        .catch(() => { this.badgeCount = 0; });
    }
  }

  /**
   * Honest threshold: hide the "N badges earned this week" pill until the real
   * count is non-embarrassing. When the pool is 1, the pill would undercut the
   * pitch more than it supports it.
   */
  readonly MIN_SOCIAL_PROOF = 10;

  get showBadgeCounter(): boolean {
    return this.badgeCount >= this.MIN_SOCIAL_PROOF;
  }

  t(key: string): string {
    return this.strings[this.lang][key] as string || '';
  }

  tList(key: string): string[] {
    return (this.strings[this.lang][key] as any) || [];
  }

  private detectLang() {
    if (!this.isBrowser) { return; }
    try {
      const nav = navigator.language || 'en';
      const stored = localStorage.getItem('richblok_lang') as Lang;
      if (stored === 'fr' || stored === 'en') {
        this.lang = stored;
      } else if (nav.toLowerCase().startsWith('fr')) {
        this.lang = 'fr';
      }
    } catch { /* ignore */ }
  }

  setLang(l: Lang) {
    this.lang = l;
    if (this.isBrowser) {
      try { localStorage.setItem('richblok_lang', l); } catch { /* ignore */ }
      this.analytics.track('LanguageChange', { language: l });
    }
  }

  // Week-1 repositioning: primary CTA now points at /evaluate (challenges),
  // secondary keeps the /onboard CV path. The analytics event names are
  // preserved so funnel dashboards don't break — only the destinations flip.
  primaryCta() {
    this.analytics.track('LandingCtaClick', { cta: 'primary_hero_ai_pair_challenge' });
    const user = this.isBrowser ? this.auth.currentUser : null;
    if (user) {
      this.router.navigate(['/evaluate']);
    } else {
      this.router.navigate(['/register'], { queryParams: { from: 'landing_ai_pair' } });
    }
  }

  secondaryCta() {
    this.analytics.track('LandingCtaClick', { cta: 'secondary_hero_upload_cv' });
    this.router.navigate(['/onboard']);
  }

  goSignIn() {
    this.analytics.track('LandingCtaClick', { cta: 'nav_signin' });
    this.router.navigate(['/sign-in']);
  }

  goUpgrade() {
    this.analytics.track('LandingCtaClick', { cta: 'pricing_pro' });
    this.analytics.track('InitiateCheckout', { plan: this.annualBilling ? 'pro_annual' : 'pro_monthly' });
    const user = this.isBrowser ? this.auth.currentUser : null;
    if (user) {
      this.router.navigate(['/settings'], { queryParams: { upgrade: 1 } });
    } else {
      this.router.navigate(['/register'], { queryParams: { plan: 'pro' } });
    }
  }

  toggleFaq(i: number) {
    this.faqOpen[i] = !this.faqOpen[i];
  }
}
