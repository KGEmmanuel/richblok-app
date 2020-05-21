import { Injectable } from '@angular/core';
import { JobApplication } from '../entites/JobApplication';
import { AngularFirestore } from '@angular/fire/firestore';
import { BaseService } from './BasetService.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService extends BaseService<JobApplication>{

  constructor(afs: AngularFirestore) {
    const path = 'jobsapplication';
    // alert(path);
    super(path, afs);

  }
}
