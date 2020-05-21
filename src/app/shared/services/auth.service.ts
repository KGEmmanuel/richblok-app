import { Injectable, NgZone } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Utilisateur } from '../entites/Utilisateur';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TagsService } from './tags.service';
import { tag } from '@turf/turf';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any; // Save logged in user data
  currentUser: Observable<Utilisateur>;
  readonly userPath = 'utilisateurs';

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public tagSvc:  TagsService
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    
    firebase.firestore().enablePersistence()
      .catch(err => {
        if (err.code == 'failed-precondition') {
          // only be enabled in one tab at a a time (multiple tabs open)
        } else if (err.code == 'unimplemented') {
          // browser does not support all of the features required to enable persistence
        }
      });
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['feed']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        this.ngZone.run(() => {
          this.router.navigate(['sign-in']);
        });
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['forgot-password']);
      })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['feed']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`${this.userPath}/${user.uid}`);
    const userData: Utilisateur = {
      id: user.uid,
      email: user.email,
      nom: user.displayName,
      imageprofil: user.photoURL,
      emailVerified: user.emailVerified,
      tags: this.tagSvc.buildTags([user.displayName])
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
      alert('signout');
    }).catch(err=>{
       alert(err.message);
    })
  }


}
