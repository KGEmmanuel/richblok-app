import { Injectable } from '@angular/core';
import { JobApplication } from '../entites/JobApplication';
import { Firestore } from '@angular/fire/firestore';
import { BaseService } from './BasetService.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService extends BaseService<JobApplication>{

  constructor(firestore: Firestore) {
    super('jobsapplication', firestore);
  }
}
