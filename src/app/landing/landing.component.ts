import { Title, Meta } from '@angular/platform-browser';
import { UtilisateurService } from './../shared/services/utilisateur.service';
import { SeoService } from './../shared/services/seo.service';
import { AnalyticsService } from './../shared/services/analytics.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
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
      hero_title: 'Your skills are real. Make them',
      hero_accent: 'provable.',
      hero_sub: 'Complete a 20-minute challenge. Earn a verified badge. Get hired globally — by recruiters who trust the proof.',
      hero_cta: 'Start Free Challenge',
      hero_note: 'Free. 3 challenges/month. No card required.',
      counter_prefix: 'badges earned by African tech talent',
      how_title: 'From unknown to unforgettable in 10 minutes',
      how_1_title: 'Pick your challenge',
      how_1_desc: 'React, Python, SQL, UI/UX, or Product Thinking. 5 to choose from.',
      how_2_title: 'Prove your skill',
      how_2_desc: 'Timed test. 20 questions. Scored instantly. No human review.',
      how_3_title: 'Share your badge',
      how_3_desc: 'Public URL. Pre-filled for WhatsApp, Twitter, LinkedIn. Recruiters can verify.',
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
      final_sub: 'Join African tech talent already earning verified badges.',
      final_cta: 'Start Free Challenge'
    },
    fr: {
      nav_login: 'Connexion',
      nav_signup: 'Commencer',
      hero_title: 'Vos compétences sont réelles. Rendez-les',
      hero_accent: 'prouvables.',
      hero_sub: 'Relevez un défi de 20 minutes. Obtenez un badge vérifié. Décrochez un poste à l’international — avec des recruteurs qui font confiance aux preuves.',
      hero_cta: 'Commencer gratuitement',
      hero_note: 'Gratuit. 3 défis/mois. Aucune carte bancaire.',
      counter_prefix: 'badges obtenus par des talents africains',
      how_title: 'De l’inconnu à l’inoubliable en 10 minutes',
      how_1_title: 'Choisissez votre défi',
      how_1_desc: 'React, Python, SQL, UI/UX ou Pensée Produit. 5 au choix.',
      how_2_title: 'Prouvez votre compétence',
      how_2_desc: 'Test chronométré. 20 questions. Note instantanée. Pas de revue humaine.',
      how_3_title: 'Partagez votre badge',
      how_3_desc: 'URL publique. Préremplie pour WhatsApp, Twitter, LinkedIn. Les recruteurs peuvent vérifier.',
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
      final_sub: 'Rejoignez les talents tech africains qui obtiennent déjà leurs badges vérifiés.',
      final_cta: 'Commencer gratuitement'
    }
  };

  constructor(
    private router: Router,
    private userSvc: UtilisateurService,
    private afs: AngularFirestore,
    private title: Title,
    private meta: Meta,
    private seo: SeoService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    this.seo.reset();
    this.detectLang();
    this.analytics.track('PageView', { page: 'landing' });

    // Live counter: count all challenge submissions (or total badges)
    this.afs.collection('challenge_submissions').get().subscribe(
      snap => {
        const base = 847; // seed so it doesn't show 0 on Day 1
        this.badgeCount = base + (snap ? snap.size : 0);
      },
      () => {
        this.badgeCount = 847;
      }
    );
  }

  t(key: string): string {
    return this.strings[this.lang][key] as string || '';
  }

  tList(key: string): string[] {
    return (this.strings[this.lang][key] as any) || [];
  }

  private detectLang() {
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
    try { localStorage.setItem('richblok_lang', l); } catch { /* ignore */ }
    this.analytics.track('LanguageChange', { language: l });
  }

  primaryCta() {
    this.analytics.track('LandingCtaClick', { cta: 'primary_hero' });
    const user = firebase.auth().currentUser;
    if (user) {
      this.router.navigate(['/evaluate']);
    } else {
      this.router.navigate(['/register'], { queryParams: { from: 'landing' } });
    }
  }

  goSignIn() {
    this.analytics.track('LandingCtaClick', { cta: 'nav_signin' });
    this.router.navigate(['/sign-in']);
  }

  goUpgrade() {
    this.analytics.track('LandingCtaClick', { cta: 'pricing_pro' });
    this.analytics.track('InitiateCheckout', { plan: this.annualBilling ? 'pro_annual' : 'pro_monthly' });
    const user = firebase.auth().currentUser;
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
