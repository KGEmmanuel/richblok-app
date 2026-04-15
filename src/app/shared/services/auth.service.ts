import { Injectable, NgZone } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Utilisateur } from '../entites/Utilisateur';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TagsService } from './tags.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  currentUser: Observable<Utilisateur>;
  readonly userPath = 'utilisateurs';

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public tagSvc: TagsService,
    private toastr: ToastrService
  ) {
    // Fire-and-forget: offline persistence is a nice-to-have, not required.
    // Silently swallow failed-precondition (multiple tabs) and unimplemented (browser unsupported).
    try {
      (firebase.firestore().enablePersistence as any)({ synchronizeTabs: true })
        .catch(() => { /* ignore */ });
    } catch (_) { /* ignore */ }
  }

  /**
   * Translates Firebase Auth error codes into user-friendly messages.
   */
  private friendlyAuthError(err: any): string {
    const code = err && err.code ? err.code : '';
    const message = err && err.message ? err.message : 'Something went wrong';
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with that email. Create one below?';
      case 'auth/wrong-password':
        return 'Incorrect password. Try again or reset it.';
      case 'auth/invalid-email':
        return 'That email address is not valid.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact support.';
      case 'auth/too-many-requests':
        return 'Too many sign-in attempts. Please wait a few minutes and try again.';
      case 'auth/network-request-failed':
        return 'Network issue — please check your internet and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is currently disabled. Contact support.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for sign-in. Contact support.';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      default:
        return message || 'Sign-in failed. Please try again.';
    }
  }

  /**
   * Sign in with email/password. Returns the user or throws a friendly error.
   */
  SignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user).catch(err => {
          // Non-fatal: user is authenticated even if doc write fails
          // eslint-disable-next-line no-console
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

  /**
   * Create a new account with email/password.
   */
  SignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        const msg = this.friendlyAuthError(error);
        this.toastr.error(msg, 'Sign-up failed');
        throw error;
      });
  }

  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.toastr.success('Verification email sent. Check your inbox.', 'Email sent');
        this.router.navigate(['forgot-password']);
      });
  }

  /**
   * Send password reset email.
   */
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
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
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null && user.emailVerified !== false);
    } catch {
      return false;
    }
  }

  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  AuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.SetUserData(result.user).catch(err => {
          // eslint-disable-next-line no-console
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

  /**
   * Writes minimal user data to Firestore. Only writes fields that have a value
   * (avoids overwriting existing profile fields with null on subsequent sign-ins).
   */
  SetUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`${this.userPath}/${user.uid}`);
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
    return userRef.set(userData, { merge: true });
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    }).catch(err => {
      this.toastr.error(err && err.message ? err.message : 'Sign-out failed', 'Error');
    });
  }
}
