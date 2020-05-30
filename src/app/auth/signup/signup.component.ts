import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { ToastrService } from 'ngx-toastr';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email;
  password;
  confirmpassword;
  step: number;
  regexp:any;
  fieldTextType: boolean;
  repeatFieldTextType: boolean;

  user: Utilisateur;
  constructor(private AuthSvc: AuthService, private toastr: ToastrService, private userSvc: UtilisateurService, private loadingSvc: NgxUiLoaderService,public ngZone: NgZone, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.step = 1;
    this.user = new Utilisateur();
    if (this.route.snapshot.paramMap.get('mail')) {
      this.email = this.route.snapshot.paramMap.get('mail');
     // alert(this.currentitemId);
    }
    // tslint:disable-next-line: max-line-length
  }
  valid(): boolean{
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!re.test(String(this.email).toLowerCase())) {
      this.toastr.error('Enter a valid email address', 'Error');
      return false;
     }
    if (this.password.length < 6) {
      this.toastr.error('Your password must have 6 or more characters', 'Error');
      return false;
     }
    if (this.password !== this.confirmpassword) {
        this.toastr.error('Your passwords must be identical', 'Error');
        return false;
      }
    return true;

  }
  next() {
    if (!this.valid()) {
      return;
    }
    this.step += 1;
  }
  back() {
    this.step -= 1;
  }

  signUp() {
    // tslint:disable-next-line: no-unused-expression
    this.loadingSvc.start();
    this.AuthSvc.SignUp(this.email, this.password).then(v=>{
      this.user.email = this.email;

        this.userSvc.set(this.user,v.user.uid).then(v=>{

            this.ngZone.run(() => {
              this.router.navigate(['sign-in']);
            });

        }).catch(err=>{
           this.toastr.error('An error occured, '+err.message);
        })
    }).catch(err=>{
      this.toastr.error('An error occured, '+err.message);
   })
  }

  deleteCenterOfInterest(tag){
    const idx = this.user.tags.indexOf(tag);
    this.user.tags.splice(idx,1);
  }

  addCenterOfInterest(tag){
    if(!this.user.tags)
    {
      this.user.tags = [];
    }
    this.user.tags.push(tag);
  }


  loginWithGoogle() {
    this.AuthSvc.GoogleAuth();
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

}
