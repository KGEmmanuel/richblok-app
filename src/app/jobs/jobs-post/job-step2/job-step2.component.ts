import { Component, OnInit } from '@angular/core';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { Preinterview } from 'src/app/shared/entites/preinterview';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-step2',
  templateUrl: './job-step2.component.html',
  styleUrls: ['./job-step2.component.scss']
})
export class JobStep2Component implements OnInit {

  skill: Preinterview;
  offre: OffresEmploi;
  numberSkill: number;
  details = false;
  constructor(private toastr: ToastrService) { }
  time = { hour: 13, minute: 30 };
  spinners = false;
  step: number;
  ngOnInit() {
    this.step = 1;
    this.numberSkill = 0;
    this.skill = new Preinterview();
    this.offre = new OffresEmploi();
  }

  next() {
    this.step += 1;
  }
  back() {
    this.step -= 1;
  }
  add() {
    this.push();
    this.details = true;
  }
  delete(i: number): void {
    this.offre.preinterview.splice(i, 1);
  }
  push() {
    if (!this.offre.preinterview) {
      this.offre.preinterview = [];
    }
    const res = this.offre.preinterview.find(al => al.skillname.toUpperCase() === this.skill.skillname.toUpperCase());

    if (res) {
      this.toastr.error('Skill already added', 'Error');
      return;
    }
    this.offre.preinterview.push(this.skill);
    this.skill = new Preinterview();
    this.numberSkill += 1;
    this.toastr.success('Skill added succesfully', 'Success');
  }

}
