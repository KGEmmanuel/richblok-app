import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Lang = 'en' | 'fr';

/**
 * Minimal i18n service — no heavy deps.
 * Dictionary lives in one place; components subscribe to lang$ to re-translate reactively.
 * English is the default fallback when a key is missing in the current language.
 */
@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private langSubject = new BehaviorSubject<Lang>('en');
  lang$: Observable<Lang> = this.langSubject.asObservable();

  private readonly dict: Record<Lang, Record<string, string>> = {
    en: {
      // Shared
      app_name: 'RichBlok',
      cta_start_free: 'Start Free Challenge',
      cta_sign_in: 'Sign in',
      cta_sign_up: 'Get started',
      cta_sign_out: 'Sign out',
      cta_continue: 'Continue',
      cta_cancel: 'Cancel',
      cta_save: 'Save',
      free_note: 'Free. 3 challenges/month. No card required.',

      // Auth: sign-in
      signin_title: 'Welcome back',
      signin_sub: 'Don\'t miss your next opportunity. Sign in to stay updated on your professional world.',
      signin_email: 'Email',
      signin_password: 'Password',
      signin_remember: 'Remember password',
      signin_forgot: 'Forgot password?',
      signin_new_q: 'New to RichBlok?',
      signin_new_join: 'Join now',
      signin_or: 'Or login with',
      signin_submit: 'Sign in',
      signin_loading: 'Signing in…',

      // Auth: sign-up
      signup_title: 'Create your account',
      signup_sub: 'Prove your skills to global recruiters in 10 minutes.',
      signup_email: 'Email address',
      signup_password: 'Password',
      signup_password_confirm: 'Confirm password',
      signup_submit: 'Create account',
      signup_already_q: 'Already on RichBlok?',
      signup_already_link: 'Sign in',

      // Auth: reset
      reset_title: 'First, let\'s find your account',
      reset_sub: 'An email will be sent to you to reset your password.',
      reset_submit: 'Send reset email',
      reset_loading: 'Sending…',
      reset_sent_title: 'Check your inbox',

      // Evaluate / challenge
      eval_title: 'Find a challenge',
      eval_empty: 'No challenges yet. Check back in a minute.',
      challenge_start: 'Start challenge',
      challenge_submit: 'Submit & Get My Badge',
      challenge_scoring: 'Scoring your answers…',
      challenge_next: 'Next',

      // Badge page
      badge_verified_by: 'Verified by Richblok',
      badge_share: 'Share this badge',
      badge_contact: 'Contact',
      badge_earn_own: 'Earn your own badge',
      badge_real: 'Real skill. Verified.',

      // Upgrade modal
      upgrade_later: 'Maybe later',
      upgrade_guarantee: '30-day money-back guarantee · Cancel anytime',
      upgrade_monthly: 'Monthly',
      upgrade_yearly: 'Yearly'
    },
    fr: {
      app_name: 'RichBlok',
      cta_start_free: 'Commencer gratuitement',
      cta_sign_in: 'Connexion',
      cta_sign_up: 'Commencer',
      cta_sign_out: 'Déconnexion',
      cta_continue: 'Continuer',
      cta_cancel: 'Annuler',
      cta_save: 'Enregistrer',
      free_note: 'Gratuit. 3 défis/mois. Aucune carte bancaire.',

      signin_title: 'Bienvenue',
      signin_sub: 'Ne manquez pas votre prochaine opportunité. Connectez-vous pour rester au courant.',
      signin_email: 'Email',
      signin_password: 'Mot de passe',
      signin_remember: 'Se souvenir de moi',
      signin_forgot: 'Mot de passe oublié ?',
      signin_new_q: 'Nouveau sur RichBlok ?',
      signin_new_join: 'S\'inscrire',
      signin_or: 'Ou connectez-vous avec',
      signin_submit: 'Se connecter',
      signin_loading: 'Connexion…',

      signup_title: 'Créez votre compte',
      signup_sub: 'Prouvez vos compétences aux recruteurs internationaux en 10 minutes.',
      signup_email: 'Adresse email',
      signup_password: 'Mot de passe',
      signup_password_confirm: 'Confirmez le mot de passe',
      signup_submit: 'Créer le compte',
      signup_already_q: 'Déjà sur RichBlok ?',
      signup_already_link: 'Se connecter',

      reset_title: 'D\'abord, retrouvons votre compte',
      reset_sub: 'Un email vous sera envoyé pour réinitialiser votre mot de passe.',
      reset_submit: 'Envoyer l\'email',
      reset_loading: 'Envoi…',
      reset_sent_title: 'Vérifiez votre boîte mail',

      eval_title: 'Trouvez un défi',
      eval_empty: 'Aucun défi pour l\'instant. Revenez dans un instant.',
      challenge_start: 'Commencer le défi',
      challenge_submit: 'Soumettre & obtenir mon badge',
      challenge_scoring: 'Notation de vos réponses…',
      challenge_next: 'Suivant',

      badge_verified_by: 'Vérifié par Richblok',
      badge_share: 'Partager ce badge',
      badge_contact: 'Contacter',
      badge_earn_own: 'Obtenez votre propre badge',
      badge_real: 'Vraie compétence. Vérifiée.',

      upgrade_later: 'Plus tard',
      upgrade_guarantee: 'Satisfait ou remboursé 30 jours · Annulation en un clic',
      upgrade_monthly: 'Mensuel',
      upgrade_yearly: 'Annuel'
    }
  };

  constructor() {
    this.detect();
  }

  get current(): Lang {
    return this.langSubject.value;
  }

  set(lang: Lang): void {
    this.langSubject.next(lang);
    try { localStorage.setItem('richblok_lang', lang); } catch { /* ignore */ }
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang);
      }
    } catch { /* ignore */ }
  }

  t(key: string, fallback?: string): string {
    const lang = this.langSubject.value;
    return this.dict[lang][key] || this.dict.en[key] || fallback || key;
  }

  private detect(): void {
    try {
      const stored = localStorage.getItem('richblok_lang') as Lang;
      if (stored === 'en' || stored === 'fr') {
        this.set(stored);
        return;
      }
    } catch { /* ignore */ }
    try {
      const nav = (navigator.language || 'en').toLowerCase();
      if (nav.startsWith('fr')) {
        this.set('fr');
        return;
      }
    } catch { /* ignore */ }
    this.set('en');
  }
}
