import { Title, Meta } from '@angular/platform-browser';
import { UtilisateurService } from './../shared/services/utilisateur.service';
import { SeoService } from './../shared/services/seo.service';
import { AnalyticsService } from './../shared/services/analytics.service';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

type Lang = 'en' | 'fr';

@Component({
  selector: 'app-landing',
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
      hero_title: 'Turn your CV into',
      hero_accent: 'interview-ready stories — in 60 seconds.',
      hero_sub: 'Upload your CV. Richblok drafts your behavioral (STAR) answers for every role — Leadership, Decision-Making, Pressure Performance. Then verify each story with a 20-minute challenge so recruiters trust the proof.',
      hero_cta: 'Upload your CV',
      hero_cta_sub: 'Step 2 — Verify your stories with a 20-min challenge',
      hero_note: 'Free. No card. PDF stays private — bytes discarded after parsing.',
      counter_prefix: 'CVs turned into verified stories',
      how_title: 'Upload, verify, get discovered — the shortcut to interview confidence.',
      how_1_title: 'Upload your CV',
      how_1_desc: 'Drop your PDF. We instantly draft STAR answers for 5+ behavioral competencies — grounded in your real experiences and projects.',
      how_2_title: 'Verify with a 20-min challenge',
      how_2_desc: 'Take a quick scored challenge. Each passed challenge flips matching stories from "draft" to "✓ verified" — proof recruiters can click.',
      how_3_title: 'Practice + get discovered',
      how_3_desc: 'AI coach helps you sharpen each answer. Verified profile is searchable by employers hiring African remote talent.',
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
      faq_1_a: 'LinkedIn trusts what you type. Richblok trusts what you prove. Every badge is earned from a timed, scored challenge — not typed into a text field.',
      faq_2_q: 'Do recruiters actually use this?',
      faq_2_a: 'Your badges have a public URL. Every time you share one on WhatsApp, LinkedIn, or Twitter, recruiters see a live, verified score they can click to validate.',
      faq_3_q: 'Can I use it on my phone?',
      faq_3_a: 'Yes — Richblok is mobile-first. Challenges, badges, and sharing all work beautifully on Android and iPhone, even on 3G.',
      faq_4_q: 'What payment methods work in Africa?',
      faq_4_a: 'Visa, Mastercard, Verve, and local bank cards via Stripe. Works in Nigeria, Kenya, Ghana, South Africa, Cameroon, Senegal, and 20+ more.',
      final_title: 'Ready to be provable?',
      final_sub: 'Upload your CV now — get 5+ draft STAR stories in 60 seconds, then verify them with a 20-min challenge.',
      final_cta: 'Upload your CV',
      hero_secondary_cta: 'Or start with a challenge →'
    },
    fr: {
      nav_login: 'Connexion',
      nav_signup: 'Commencer',
      hero_title: 'Transformez votre CV en',
      hero_accent: 'histoires d\'entretien — en 60 secondes.',
      hero_sub: 'Déposez votre CV. Richblok rédige vos réponses comportementales (STAR) pour chaque rôle — Leadership, Décision, Performance sous pression. Puis vérifiez chaque histoire avec un défi de 20 min pour que les recruteurs fassent confiance à la preuve.',
      hero_cta: 'Déposer mon CV',
      hero_cta_sub: 'Étape 2 — Vérifiez vos histoires avec un défi de 20 min',
      hero_note: 'Gratuit. Sans carte. PDF privé — fichiers supprimés après analyse.',
      counter_prefix: 'CV transformés en histoires vérifiées',
      how_title: 'Déposez, vérifiez, soyez découvert — le raccourci vers la confiance en entretien.',
      how_1_title: 'Déposez votre CV',
      how_1_desc: 'Déposez votre PDF. On rédige instantanément vos réponses STAR pour 5+ compétences comportementales — ancrées dans vos vraies expériences et projets.',
      how_2_title: 'Vérifiez avec un défi de 20 min',
      how_2_desc: 'Relevez un défi scoré. Chaque défi réussi fait passer vos histoires de « brouillon » à « ✓ vérifié » — une preuve cliquable pour les recruteurs.',
      how_3_title: 'Entraînez-vous et soyez repéré',
      how_3_desc: 'Un coach IA vous aide à affiner chaque réponse. Votre profil vérifié est recherché par les recruteurs.',
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
      final_sub: 'Déposez votre CV maintenant — 5+ histoires STAR brouillon en 60 secondes, puis vérifiez-les avec un défi de 20 min.',
      final_cta: 'Déposer mon CV',
      hero_secondary_cta: 'Ou commencer par un défi →'
    }
  };

  constructor(
    private router: Router,
    private userSvc: UtilisateurService,
    private afs: AngularFirestore,
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
      // Live counter: count all challenge submissions. Skipped on SSR so the
      // page renders fast + deterministic for crawlers; client hydrates it.
      this.afs.collection('challenge_submissions').get().subscribe(
        snap => {
          const base = 847;
          this.badgeCount = base + (snap ? snap.size : 0);
        },
        () => { this.badgeCount = 847; }
      );
    } else {
      this.badgeCount = 847;
    }
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

  primaryCta() {
    this.analytics.track('LandingCtaClick', { cta: 'primary_hero_upload_cv' });
    this.router.navigate(['/onboard']);
  }

  secondaryCta() {
    this.analytics.track('LandingCtaClick', { cta: 'secondary_hero_challenge' });
    const user = this.isBrowser ? firebase.auth().currentUser : null;
    if (user) {
      this.router.navigate(['/evaluate']);
    } else {
      this.router.navigate(['/register'], { queryParams: { from: 'landing_challenge' } });
    }
  }

  goSignIn() {
    this.analytics.track('LandingCtaClick', { cta: 'nav_signin' });
    this.router.navigate(['/sign-in']);
  }

  goUpgrade() {
    this.analytics.track('LandingCtaClick', { cta: 'pricing_pro' });
    this.analytics.track('InitiateCheckout', { plan: this.annualBilling ? 'pro_annual' : 'pro_monthly' });
    const user = this.isBrowser ? firebase.auth().currentUser : null;
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
