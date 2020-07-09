import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { Realisation } from 'src/app/shared/entites/Realisation';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';
import * as firebase from 'firebase';
import { Media } from 'src/app/shared/entites/Media';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-record-realisation-form',
  templateUrl: './record-realisation-form.component.html',
  styleUrls: ['./record-realisation-form.component.scss']
})
export class RecordRealisationFormComponent implements OnInit {
  @Input()
  currentRealisation: Realisation;
  @Output()
  itemSaved = new EventEmitter<boolean>();
  freelanceForm = false;
  currentOnIt = false;
  uid;
  urls= [];
  image = [];
  files: File[] = [];
  outil: string;
  realForm: FormGroup;
submitted = false;
  constructor(private realSvc: PortfolioService, private afStorage: AngularFireStorage, private afAuth: AngularFireAuth,
              private toastr: ToastrService, private loadsvc: NgxUiLoaderService, private formBuilder: FormBuilder) {
    this.afAuth.authState.subscribe(val => {
      if (val) {
        this.uid = val.uid;
      }
    })
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      // this.files.push(event.target.files);
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        console.log(event.target.files[0]);
        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);

        }
        this.files.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);
        //this.files.push(reader)
      }
    }

  }


  onImage(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      // this.files.push(event.target.files);
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        console.log(event.target.files[0]);
        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.image.push(event.target.result);

        }
        this.files.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);
        //this.files.push(reader)
      }
    }
  }



  ngOnInit() {
    if (!this.currentRealisation) {
      this.currentRealisation = new Realisation();
    }
    this.realForm = this.formBuilder.group({
      nom: ['', Validators.required],
      typeProj: ['', Validators.required],
      datedeb: ['', Validators.required],
      encours: ['', Validators.required],
      description: ['', Validators.required],
}, );
  }

  checkChanged(event) {
    this.currentOnIt = !this.currentOnIt;
    this.currentRealisation.clientcontact = null;
    this.currentRealisation.clientname = null;
    this.currentRealisation.clientref = null;
  }

  get f() { return this.realForm.controls; }
  save(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.realForm.invalid) {
        return;
    }
    this.loadsvc.start();
    if (!this.currentRealisation.id) {
      Promise.all(this.uploadallFiles(this.files)).then(v => {
        console.log('Medias is ' + this.currentRealisation.medias)
        this.realSvc.add(this.uid, this.currentRealisation).then(v => {
          this.loadsvc.stop();
          this.toastr.success('Realisation successfuly saved', 'Success');
          this.itemSaved.emit(true);
          this.currentRealisation = new Realisation();
        }).catch(err => {
          this.loadsvc.stop();
          this.toastr.error('An Error occured while saving your realisation: ' + err.message, 'Ooops');
        })
      })
    } else {
      Promise.all(this.uploadallFiles(this.files)).then(v => {
        console.log('Medias is ' + this.currentRealisation.medias)
        this.realSvc.update(this.uid, this.currentRealisation).then(v => {
          this.loadsvc.stop();
          this.toastr.success('Realisation successfuly modified', 'Success');
          this.itemSaved.emit(true);
          this.currentRealisation = new Realisation();
        }).catch(err => {
          this.loadsvc.stop();
          this.toastr.error('An Error occured while saving your realisation: ' + err.message, 'Ooops');
        })
      })
    }
  }
  addTag() {
    if (this.currentRealisation.outilsutilises.includes(this.outil.toUpperCase())) {
      this.toastr.error('Tag alrady exist', 'Error');
      return;
    }

    this.currentRealisation.outilsutilises.push(this.outil.toUpperCase());
    this.outil = '';
    this.toastr.success('Added succesfully', 'Success');
  }

  deleteTag(i: number): void {
    this.currentRealisation.outilsutilises.splice(i, 1);
  }
  async upload(file) {
    // const user = this.getcurrentuser();
    const filePath = 'realisations/' + this.currentRealisation.id + '/' + '_' + (new Date().getMilliseconds()) + file.name;

    const fileRef = firebase.storage().ref(filePath);
    await fileRef.put(file).then(s => {

      if (!this.currentRealisation.medias) {
        this.currentRealisation.medias = new Array<Media>();
      }
      // mediatype: string; // VID, IMG, DOC, UNK
      const m = new Media();
      const ext: string = file.type;
      if (ext.toLowerCase().includes('image')) {
        m.mediatype = 'IMG';
      }
      else if (ext.toLowerCase().includes('video')) {
        m.mediatype = 'VID';
      }
      else if (ext.toLowerCase().includes('document')) {
        m.mediatype = 'DOC';
      }
      fileRef.getDownloadURL().then(v => {
        m.src = v;
        console.log('cool' + m);
        this.currentRealisation.medias.push(m);
        console.log(this.currentRealisation.medias);
      });

    }).catch(err => {
      this.toastr.error('erreur d\'upload de fichier ' + err.message);
    });

  }


  uploadallFiles(files: File[]) {

    const allPromises = [];
    files.forEach(el => {
      const filePath = 'posts/' + this.currentRealisation.id + '/' + '_' + (new Date().getMilliseconds()) + el.name;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, el);
      allPromises.push(task);
      // allPercentage.push(_percentage$);

      // observe percentage changes
      // this.uploadPercent = task.percentageChanges();

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            if (!this.currentRealisation.medias) {
              this.currentRealisation.medias = new Array<Media>();
            }
            // mediatype: string; // VID, IMG, DOC, UNK
            const m = new Media();
            const ext: string = el.type;
            m.mediatype = 'IMG';
            if (ext.toLowerCase().includes('image')) {
              m.mediatype = 'IMG';
            }
            else if (ext.toLowerCase().includes('video')) {
              m.mediatype = 'VID';
            }
            else if (ext.toLowerCase().includes('document')) {
              m.mediatype = 'DOC';
            }
            m.src = url;
            this.currentRealisation.medias.push(m);
          });
        })
      ).subscribe();
      // this.downloadURLs.push(this.downloadURL);
    });
    return allPromises;
  }
}

