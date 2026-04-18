import { Component, OnInit, inject } from '@angular/core';
import { Demonstration } from 'src/app/shared/entites/demonstration';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Experience } from 'src/app/shared/entites/Experience';
import { Formation } from 'src/app/shared/entites/Formation';
import { Skill } from 'src/app/shared/entites/Skill';
import { Langue } from 'src/app/shared/entites/Langue';
import { Post } from 'src/app/shared/entites/Post';
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { ExperienceService } from 'src/app/shared/services/experience.service';
import { FormationService } from 'src/app/shared/services/formation.service';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import { SkillsService } from 'src/app/shared/services/skills.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ToastrService } from 'ngx-toastr';
import { DemonstrateService } from 'src/app/shared/services/demonstrate.service';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { Media } from 'src/app/shared/entites/Media';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Storage, ref as storageRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-demonstrate-form',
  templateUrl: './demonstrate-form.component.html',
  styleUrls: ['./demonstrate-form.component.scss']
})
export class DemonstrateFormComponent implements OnInit {
  
  public step: number = 1;
  currentDemonst: Demonstration;
  form = false;
  safeSrc: SafeResourceUrl;

  experiences: Array<Experience>;
  formations: Array<Formation>;
  competences: Array<Skill>;
  langues: Array<Langue>;


  experiencekey = 'libelle';
  formationkey = 'libelle';
  languekey = 'libele';
  skillkey = 'skillName';
  post = new Post();
  postinitiated = false;
  saved = false;

  uid;
  user: Utilisateur;
  currentitemId: string;
  // realisations: Array<any>

  private auth = inject(Auth);
  private storage = inject(Storage);

  constructor(private sanitizer: DomSanitizer, private expSvc: ExperienceService, private formSvc: FormationService
    , private skillSvc: SkillsService, private lngSvc: LanguageService, private route: ActivatedRoute,
    private demoSvc: DemonstrateService, private tostSvc: ToastrService, private postSvc: PostService,
    private userSvc: UtilisateurService) {
    if (!this.currentDemonst) {
      this.currentDemonst = new Demonstration();
    }
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentDemonst.contentVideo);
  }
  urls = [];
  files = [];
  tempMedias: Media[];
  uploadpromise = [];
  

  contentmedia: Media;

  onSelectFile(event) {
    if (!this.tempMedias) {
      this.tempMedias = [];
    }
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const med = new Media();
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
          med.src = event.target.result;
        }
        this.files.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);

        const name = event.target.files[i].name as string;
        if (name.toLowerCase().endsWith('.jpg') || name.toLowerCase().endsWith('.png')) {
          med.mediatype = 'IMG';
        } else {
          if (name.toLowerCase().endsWith('.pdf')) {
            med.mediatype = 'DOC';
          } else {
            if (name.toLowerCase().endsWith('.mp4') || name.toLowerCase().endsWith('.avi')) {
              med.mediatype = 'VID';
            }
          }
        }
        this.tempMedias.push(med);
      }
    }
    console.log(this.files);
  }

  showForm() {
    this.form = true;
  }

  preparepost() {

    this.post.medias = [];
    if (this.currentDemonst.content) {
      this.contentmedia = new Media();
      this.contentmedia.mediatype = 'HTML';
      this.contentmedia.src = this.currentDemonst.content;
      this.post.medias.push(this.contentmedia);
    }
    if (!this.tempMedias) {
      this.postinitiated = true;
      return;
    }
    this.post.medias = this.post.medias.concat(this.tempMedias);
    this.post.owner = this.uid;
    this.post.titre = this.currentDemonst.title;
    this.post.typePost = 'Demonstration';
    this.post.date = Date.now();
    this.post.description = this.currentDemonst.description;
    this.postinitiated = true;
    console.log('Post ...',this.post);
    this.next();
  }

  ngOnInit() {
    this.saved = false;
    if (!this.post) {
      this.post = new Post();
    }
    if (this.route.snapshot.paramMap.get('type')) {
      this.currentDemonst.elementType = this.route.snapshot.paramMap.get('type');
    }
    if (this.route.snapshot.paramMap.get('id')) {
      this.currentitemId = this.route.snapshot.paramMap.get('id');
      this.currentDemonst.relatedElement = this.currentitemId;
     // alert(this.currentitemId);
    }
    onAuthStateChanged(this.auth, val => {
      if (val) {
        this.uid = val.uid;
        this.userSvc.getDocRef(this.uid).onSnapshot(v => {
          this.user = v.data() as Utilisateur;
          this.user.id = val.uid;
        });

        // Experiences
        this.expSvc.listExperiences(this.uid).onSnapshot(all => {
          this.experiences = [];
          all.forEach(d => {
            const ex = d.data() as Experience;
            ex.id = d.id;
            this.experiences.push(ex);
          });
        });

        // Formations
        this.formSvc.editableFormationsListQuery(this.uid).onSnapshot(all => {
          this.formations = [];
          all.forEach(d => {
            const train = d.data() as Formation;
            train.id = d.id;
            this.formations.push(train);
          });
        });

        // compétences
        this.skillSvc.getSkillsof(this.uid).onSnapshot(all => {
          this.competences = [];
          all.forEach(d => {
            const comp = d.data() as Skill;
            comp.id = d.id;
            this.competences.push(comp);
          });
        });

        // Langues
        this.lngSvc.listLanguages(this.uid).onSnapshot(all => {
          this.langues = [];
          all.forEach(l => {
            const lng = l.data() as Langue;
            lng.id = l.id;
            this.langues.push(lng);
          });
        });

      }
    });
  }

  save() {
    const filePath = 'demonstrates/' + this.uid + '/' + this.currentDemonst.relatedElement + '_' + (new Date().getMilliseconds());
    this.post.medias = [];
    if (this.currentDemonst.content) {
      this.contentmedia = new Media();
      this.contentmedia.mediatype = 'HTML';
      this.contentmedia.src = this.currentDemonst.content;
      this.post.medias.push(this.contentmedia);
    }
    const fileRef = storageRef(this.storage, filePath);
    this.files.forEach(f => {
      this.uploadpromise.push(uploadBytes(fileRef, f).then(() => {
        if (!this.currentDemonst.medias) {
          this.currentDemonst.medias = new Array<Media>();
        }
        const name = f.name as string;
        const med = new Media();
        if (name.toLowerCase().endsWith('.jpg') || name.toLowerCase().endsWith('.png')) {
          med.mediatype = 'IMG';
        } else {
          if (name.toLowerCase().endsWith('.pdf')) {
            med.mediatype = 'DOC';
          } else {
            if (name.toLowerCase().endsWith('.mp4') || name.toLowerCase().endsWith('.avi')) {
              med.mediatype = 'VID';
            }
          }
        }
        return getDownloadURL(fileRef).then(v => {
          med.src = v;
          console.log('cool dem ' + med);
          this.currentDemonst.medias.push(med);
          this.post.medias.push(med);
        });
      }).catch((err: any) => {
        console.log('error', err.message);
      }));
    });

    Promise.all(this.uploadpromise).then(alls => {
      this.demoSvc.add(this.uid, this.currentDemonst).then(val => {
        this.post.abonnees = this.user.abonnees;
        this.post.typePost = 'Demonstration';
        this.post.refSrc = val.id;
        this.postSvc.savePost(this.post).then(v => {
          this.tostSvc.success('Richblok has successfuly create publication of your demonstration', 'Success');
        });
        this.tostSvc.success('You have succeffuly save your demonstration', 'Success');
        this.saved = true;
      }).catch(err => {
        this.tostSvc.error('An Error occured' + err.message, 'Error');
      });

    }).catch(err => {
      this.tostSvc.error(err.message, 'Error');
    });

  }

  next() {
    this.step = this.step + 1;
    console.log(this.currentDemonst);
  }

  previous() {
    this.step = this.step - 1;
  }

}
