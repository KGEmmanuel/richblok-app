import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard implements CanActivate {

  constructor(
    public authService: AuthService,private afAuth: AngularFireAuth,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.afAuth.auth.onAuthStateChanged(val=>{
        if(val) {
          window.alert('You are not allowed to access this URL! You are  connectd ');
          console.log(' lkjkjqsf   ',this.afAuth.auth);
          this.router.navigate(['feed']);
        }
       })
    
    return true;
  }

}
