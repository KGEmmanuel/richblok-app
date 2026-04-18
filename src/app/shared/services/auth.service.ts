import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

// D7 Day 1 — fully migrated to modular Firebase. Public API unchanged so
// every consumer (sign-in/sign-up/reset components, /me hub, auth.interceptor)
// keeps working without edits. Internal implementation swap only.
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
import {
  Firestore,
  doc,
  setDoc,
  enableIndexedDbPersistence
} from '@angular/fire/firestore';

import { Utilisateur } from '../entites/Utilisateur';
import { TagsService } from './tags.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  currentUser: Observable<Utilisateur | null>;
  readonly userPath = 'utilisateurs';

  private auth      = inject(Auth);
  private firestore = inject(Firestore);

  constructor(
    public router: Router,
    public ngZone: NgZone,
    public tagSvc: TagsService,
    private toastr: ToastrService
  ) {
    // D7: enablePersistence → enableIndexedDbPersistence (same behavior).
    // Fire-and-forget: multi-tab + unsupported browsers fail silently.
    try {
      enableIndexedDbPersistence(this.firestore).catch(() => { /* ignore */ });
    } catch (_) { /* ignore */ }

    // authState(auth) is the modular equivalent of afAuth.authState.
    // Type-cast kept as `any` because callers treat this as Observable<Utilisateur>
    // even though the underlying stream yields firebase User. The Utilisateur
    // profile join lives in utilisateur.service's consumers, not here.
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
          this.router.navigate(['me']);
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
          this.router.navigate(['me']);
        });
        return result.user;
      })
      .catch((error) => {
        const msg = this.friendlyAuthError(error);
        this.toastr.error(msg, 'Sign-in failed');
        throw error;
      });
  }

  /**
   * Writes minimal user data to Firestore. Only writes fields that have a value
   * (avoids overwriting existing profile fields with null on subsequent sign-ins).
   */
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
