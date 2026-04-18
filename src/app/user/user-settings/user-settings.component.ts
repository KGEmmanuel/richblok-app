import { Component, OnInit, inject } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { Skill } from 'src/app/shared/entites/Skill';
import { Router } from '@angular/router';
import { SkillsService } from 'src/app/shared/services/skills.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  phone = false;

  showoutlet = false;
  private USER_ROUTE_URL = '/';
  private _nav: string;
  fbForm = false;
  twForm = false;
  lnForm = false;
  glForm = false;
  save = false;
  currentUser: Utilisateur;
  file;
  skills: Array<Skill>;
  set nav(nav: string) {
    if (nav === this.USER_ROUTE_URL) {
      this.showoutlet = false;
    } else {
      this.showoutlet = true;
    }
    this._nav = nav;
  }

  get nav() {
    // this.nav = this.router.getCurrentNavigation();
    return this._nav;
  }

  private auth = inject(Auth);

  constructor(private router: Router, private userSvc: UtilisateurService,
    private skSvc: SkillsService,
    private toasterSvc: ToastrService,
    private loadsvc: NgxUiLoaderService) {
  }

  ngOnInit() {
    this.nav = this.router.url;
    console.log((this.nav === this.USER_ROUTE_URL));
    console.log(this.nav);
    onAuthStateChanged(this.auth, val => {
      if (val) {
        this.userSvc.getDocRef(val.uid).onSnapshot(data => {
          if (data.data()) {
            this.currentUser = data.data() as Utilisateur;
            this.currentUser.id = data.id;
            this.skSvc.getSkillsof(val.uid).onSnapshot(all => {
              this.skills = [];
              all.forEach(sk => {
                this.skills.push(sk.data() as Skill);
              });
            });
          }
        });
      }
    });
    this.currentUser = new Utilisateur();
  }

  ngAfterViewInit() {
    this.nav = this.router.url;
    // // alert('after init ' + this.router.url);
    console.log((this.nav === this.USER_ROUTE_URL));
    console.log(this.nav);
  }

  saveall() {
    this.loadsvc.start();
    this.userSvc.update(this.currentUser.id, this.currentUser).then(aa => {
      this.loadsvc.stop();
      this.toasterSvc.success('Changes succefully Saved', 'Success' );
    }).catch(er => {
      this.loadsvc.stop();
      this.toasterSvc.success('Error :' + er.message, 'Ooops!!!' );
    });
  }
  updateLinks() {
    this.loadsvc.start();
    this.userSvc.update(this.currentUser.id, { facebook: this.currentUser.facebook, googleplus: this.currentUser.googleplus, linkedIn: this.currentUser.linkedIn, twiter: this.currentUser.twiter, youtube: this.currentUser.youtube, }).then(a => {
      this.loadsvc.stop();
      this.toasterSvc.success('Successfully updated', 'Success');
    }).catch(err => {
      this.loadsvc.stop();
      this.toasterSvc.error('Error: ' + err.message, 'Error while');
    });
  }
  updateAccroche() {
    this.loadsvc.start();
    this.userSvc.update(this.currentUser.id, { accroche: this.currentUser.accroche }).then(a => {
      this.loadsvc.stop();
      this.toasterSvc.success('Successfully updated', 'Success');
    }).catch(err => {
      this.loadsvc.stop();
      this.toasterSvc.error('Error: ' + err.message, 'Error while');
    });
  }
  cancel() {

    const b = confirm('Do you realy want to cancel?, By cancelling you will navigate directly to the feeds')
  if (b) {
      this.router.navigateByUrl('/feed');
    }
  }
}
