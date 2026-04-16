import { Component, OnInit, Input } from '@angular/core';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-friends-item',
  templateUrl: './friends-item.component.html',
  styleUrls: ['./friends-item.component.scss']
})
export class FriendsItemComponent implements OnInit {

  currentUser: Utilisateur;
  connectedUser: Utilisateur;
  _iduser: string;
  cancel = false;

  @Input()
  set iduser(id) {
    this.userSvc.getDocRef(id).onSnapshot(val => {
      let id1 = val.id;
      let u = val.data() as Utilisateur;
      u.id = id1;
      this.currentUser = u;
      //  alert('display' + u.nom);
    });
    this._iduser = id;
  }

  get iduser() {
    return this._iduser;
  }

  @Input() displayAmi: boolean;
  @Input() displayNeture: boolean;

  constructor(private userSvc: UtilisateurService, private router: Router, private toastSvc: ToastrService) {

  }

  ngOnInit() {
    this.userSvc.getDocRef(firebase.auth().currentUser.uid).onSnapshot(val => {
      this.connectedUser = val.data() as Utilisateur;
      this.connectedUser.id = val.id;
    });
  }

  ademander(): boolean {
    if (!this.connectedUser.demandesabonnees) {
      return false;
    }
    return this.connectedUser.demandesabonnees.includes(this._iduser);
  }

  estneutre(): boolean {
    if (!this.connectedUser.abonnees) {
      return true;
    }
    if (!this.connectedUser.demandesabonnees) {
      return true;
    }
    if (this.connectedUser.demandesabonnees.includes(this._iduser)) {
      return false;
    }
    if (this.connectedUser.abonnees.includes(this._iduser)) {
      return false;
    }
    return true;
  }

  estami(): boolean {
    if (!this.connectedUser.abonnees) {
      return false;
    }
    return this.connectedUser.abonnees.includes(this._iduser);
  }
  /**
   *  vérifie si une demande d'amis a déja été envoyé ou alors s'il est déja ami
   */
  amiOuDemande(): boolean {
    if (this.currentUser.abonnees.includes(this.connectedUser.id)) {
      return true;
    }
    if (this.currentUser.demandesabonnees.includes(this.connectedUser.id)) {
      return true;
    }

    return false;
  }

  /**
   * Vérifie si la demande a té envoyé
   */
  demandefaite(): boolean {
    if (this.currentUser.demandesabonnees.includes(this.connectedUser.id)) {
      return true;
    }
    return false;
  }

  confirmer() {
    if (!this.connectedUser.demandesabonnees) {
      this.connectedUser.demandesabonnees = new Array();
    }
    if (!this.connectedUser.demandesabonnees) {
      this.connectedUser.demandesabonnees = new Array();
    }
    const index = this.connectedUser.demandesabonnees.indexOf(this._iduser);
    this.connectedUser.demandesabonnees.splice(index);
    this.connectedUser.abonnees.push(this._iduser);
    // enregistrement
    this.userSvc.update(this.connectedUser.id, {
      'demandesabonnees': this.connectedUser.demandesabonnees,
      'abonnees': this.connectedUser.abonnees
    }).then(val => {
      this.toastSvc.success('Réussi', 'Abonnement confirmé');
      this.userSvc.setcurrentuser(this.connectedUser);
      alert('demande accepté');
    }).catch(err => {
      this.toastSvc.error('Oups...', 'Une erreur est survenu, veuillez verifier votre connexion internet et réessayer.');
    });
  }

  rejeter() {
    if (!this.connectedUser.demandesabonnees) {
      return;
    }
    const index = this.connectedUser.demandesabonnees.indexOf(this._iduser);
    this.connectedUser.demandesabonnees.splice(index);
    this.userSvc.update(this.connectedUser.id, {
      'demandesabonnees': this.connectedUser.demandesabonnees,
      'abonnees': this.connectedUser.abonnees
    }).then(val => {
      this.toastSvc.success('Invitation denied', 'Success');
      this.userSvc.setcurrentuser(this.connectedUser);
    }).catch(err => {
      this.toastSvc.error('Oups...', 'Une erreur est survenu, veuillez verifier votre connexion internet et réessayer.');
    });
  }

  annuler() {
    if (!this.currentUser.demandesabonnees) {
      return;
    }
    const index = this.currentUser.demandesabonnees.indexOf(this.connectedUser.id);
    this.currentUser.demandesabonnees.splice(index);
    this.userSvc.update(this.currentUser.id, {
      demandesabonnees: this.currentUser.demandesabonnees,
      abonnees: this.currentUser.abonnees
    }).then(val => {
      this.toastSvc.success('Invitation cancelled', 'Success');
    }).catch(err => {
      this.toastSvc.error('An error occured verify your internet connection and try again', 'Oups...');
    });
  }

  suivre() {
    this.currentUser.demandesabonnees.push(this.connectedUser.id);
    this.userSvc.update(this.currentUser.id, {
      'demandesabonnees': this.currentUser.demandesabonnees
    }).then(val => {
      this.toastSvc.success('Invitation to connect sent', 'Succcess');
      this.userSvc.setcurrentuser(this.connectedUser);
      this.cancel = true;
    }).catch(err => {
      this.toastSvc.error('An error occured verify your internet connection and try again', 'Oups...');

    });
  }




  display(): boolean {
    if (this.displayAmi) {
      if (this.estami()) {
        return true;
      }

    } else {
      if (this.displayNeture) {
        return true;
      }
    }
    return false;
  }

}
