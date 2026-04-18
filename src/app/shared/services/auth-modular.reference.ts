/**
 * D7 pilot reference — modular-Firebase port of auth.service.ts
 *
 * STATUS: NOT WIRED. Never imported. Ships ZERO bytes.
 *
 * WHY this file exists:
 *   Partial migration of compat → modular costs MORE bundle size, not less,
 *   because the build ends up pulling BOTH SDKs. The full migration is a
 *   2-3 day sprint that moves all 63 compat imports in one pass. See
 *   docs/FIREBASE_MODULAR_MIGRATION.md for the trigger + plan.
 *
 *   This file is the pilot deliverable. It proves the modular API works
 *   for every operation `auth.service.ts` performs today, documents each
 *   transform, and gives the future sprint a ready-to-lift reference.
 *
 * HOW to promote this to production (during the full D7 sprint):
 *   1. Rename `auth-modular.reference.ts` → `auth.service.ts` (overwrite)
 *      AND delete this header comment.
 *   2. AppModule: swap `AngularFireModule.initializeApp(environment.firebase)`
 *      + `AngularFireAuthModule` + `AngularFirestoreModule` for the
 *      provideFirebaseApp / provideAuth / provideFirestore providers (see
 *      docs/FIREBASE_MODULAR_MIGRATION.md for the exact diff).
 *   3. Migrate every other `@angular/fire/compat/*` import in src/app/ in
 *      the same commit. Partial = worse.
 *
 * BUNDLE SIZE EXPECTATION
 *   Measured before: main.js = 3.53 MB (compat)
 *   Expected after full migration: ~3.13 MB (-400 KB, -11%)
 *   This pilot file alone contributes 0 because nothing imports it.
 *
 * API SURFACE — IDENTICAL to auth.service.ts
 *   SignIn(email, password)     — email/password sign in
 *   SignUp(email, password)     — create account
 *   SendVerificationMail()      — send email-verify
 *   ForgotPassword(email)       — send password-reset
 *   isLoggedIn                  — localStorage-cached check
 *   GoogleAuth()                — popup sign-in with Google
 *   AuthLogin(provider)         — generic popup sign-in
 *   SetUserData(user)           — upsert utilisateurs/{uid}
 *   SignOut()                   — sign out + clear cache
 *
 * KEY TRANSFORMS (compat → modular)
 *
 *   AngularFireAuth.currentUser                      → authState(auth)
 *   afAuth.signInWithEmailAndPassword(e, p)          → signInWithEmailAndPassword(auth, e, p)
 *   afAuth.createUserWithEmailAndPassword(e, p)      → createUserWithEmailAndPassword(auth, e, p)
 *   afAuth.sendPasswordResetEmail(e)                 → sendPasswordResetEmail(auth, e)
 *   afAuth.signInWithPopup(provider)                 → signInWithPopup(auth, provider)
 *   afAuth.signOut()                                 → signOut(auth)
 *   new firebase.auth.GoogleAuthProvider()           → new GoogleAuthProvider()
 *   firebase.User                                    → User from 'firebase/auth'
 *   AngularFirestoreDocument<T>                      → DocumentReference<T>
 *   afs.doc(`utilisateurs/${uid}`)                   → doc(firestore, 'utilisateurs', uid)
 *   userRef.set(data, { merge: true })               → setDoc(userRef, data, { merge: true })
 *   firebase.firestore().enablePersistence({...})    → enableIndexedDbPersistence(firestore)
 *   user.sendEmailVerification()                     → sendEmailVerification(user)
 */

import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Modular firebase/auth
import {
  Auth,
  GoogleAuthProvider,
  User,
  AuthProvider,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  sendEmailVerification
} from '@angular/fire/auth';

// Modular firebase/firestore
import {
  Firestore,
  doc,
  setDoc,
  enableIndexedDbPersistence
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Utilisateur } from '../entites/Utilisateur';
import { TagsService } from './tags.service';

@Injectable({
  providedIn: 'root'
})
export class AuthModularReferenceService {

  // Keep the public API identical to AuthService so the rename-in-place
  // in the full sprint is a mechanical operation.
  userData: any;
  currentUser: Observable<Utilisateur | null>;
  readonly userPath = 'utilisateurs';

  // `inject()` is Angular 17's recommended DI, cleaner than constructor
  // injection for function-style providers.
  private auth      = inject(Auth);
  private firestore = inject(Firestore);

  constructor(
    public router: Router,
    public ngZone: NgZone,
    public tagSvc: TagsService,
    private toastr: ToastrService
  ) {
    // Equivalent of `firebase.firestore().enablePersistence(...)`.
    // Fire-and-forget: multi-tab + unsupported browsers fail silently.
    try {
      enableIndexedDbPersistence(this.firestore).catch(() => { /* ignore */ });
    } catch (_) { /* ignore */ }

    // authState replaces the old `currentUser` observable.
    // Callers that did `authSvc.currentUser` keep working because we
    // preserve the field — but implementation is different:
    //   compat:  AngularFirestore pipeline joined with the Firestore profile doc
    //   modular: authState(auth) — caller composes the profile read if needed
    // Keeping null-typed for this pilot; the full migration will plumb in
    // the Firestore join from the component layer.
    this.currentUser = authState(this.auth) as any;
  }

  private friendlyAuthError(err: any): string {
    const code = err && err.code ? err.code : '';
    const message = err && err.message ? err.message : 'Something went wrong';
    switch (code) {
      case 'auth/user-not-found':         return 'No account found with that email. Create one below?';
      case 'auth/wrong-password':         return 'Incorrect password. Try again or reset it.';
      case 'auth/invalid-email':          return 'That email address is not valid.';
      case 'auth/user-disabled':          return 'This account has been disabled. Contact support.';
      case 'auth/too-many-requests':      return 'Too many sign-in attempts. Please wait a few minutes and try again.';
      case 'auth/network-request-failed': return 'Network issue — please check your internet and try again.';
      case 'auth/email-already-in-use':   return 'An account with this email already exists. Try signing in.';
      case 'auth/weak-password':          return 'Password is too weak. Use at least 6 characters.';
      case 'auth/operation-not-allowed':  return 'Email/password sign-in is currently disabled. Contact support.';
      case 'auth/unauthorized-domain':    return 'This domain is not authorized for sign-in. Contact support.';
      case 'auth/popup-blocked':          return 'Popup was blocked. Please allow popups for this site.';
      case 'auth/popup-closed-by-user':   return 'Sign-in was cancelled.';
      default:                            return message || 'Sign-in failed. Please try again.';
    }
  }

  SignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.SetUserData(result.user).catch(err => {
          console.warn('SetUserData warning:', err);
        });
        this.ngZone.run(() => {
          this.router.navigate(['feed']);
        });
        return result.user;
      })
      .catch((error) => {
        const msg = this.friendlyAuthError(error);
        this.toastr.error(msg, 'Sign-in failed');
        throw error;
      });
  }

  SignUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .catch((error) => {
        const msg = this.friendlyAuthError(error);
        this.toastr.error(msg, 'Sign-up failed');
        throw error;
      });
  }

  async SendVerificationMail() {
    const user = this.auth.currentUser;
    if (!user) { throw new Error('Not signed in'); }
    await sendEmailVerification(user);
    this.toastr.success('Verification email sent. Check your inbox.', 'Email sent');
    this.router.navigate(['forgot-password']);
  }

  ForgotPassword(passwordResetEmail: string) {
    return sendPasswordResetEmail(this.auth, passwordResetEmail)
      .then(() => {
        this.toastr.success('Password reset email sent. Check your inbox (and spam folder).', 'Email sent');
      })
      .catch((error) => {
        const msg = this.friendlyAuthError(error);
        this.toastr.error(msg, 'Reset failed');
        throw error;
      });
  }

  get isLoggedIn(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return (user !== null && user.emailVerified !== false);
    } catch {
      return false;
    }
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  AuthLogin(provider: AuthProvider) {
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        this.SetUserData(result.user).catch(err => {
          console.warn('SetUserData warning:', err);
        });
        this.ngZone.run(() => {
          this.router.navigate(['feed']);
        });
        return result.user;
      })
      .catch((error) => {
        const msg = this.friendlyAuthError(error);
        this.toastr.error(msg, 'Sign-in failed');
        throw error;
      });
  }

  SetUserData(user: User | null) {
    if (!user) { return Promise.resolve(); }
    const userRef = doc(this.firestore, this.userPath, user.uid);
    const userData: any = {
      id: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    };
    if (user.displayName) {
      userData.nom = user.displayName;
      userData.tags = this.tagSvc.buildTags([user.displayName]);
    }
    if (user.photoURL) {
      userData.imageprofil = user.photoURL;
    }
    return setDoc(userRef, userData, { merge: true });
  }

  SignOut() {
    return signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    }).catch(err => {
      this.toastr.error(err && err.message ? err.message : 'Sign-out failed', 'Error');
    });
  }
}
