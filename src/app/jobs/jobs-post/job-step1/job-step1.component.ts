import { Component, OnInit } from '@angular/core';
import { OffresEmploi } from 'src/app/shared/entites/OffresEmploi';
import { JobSkill } from 'src/app/shared/entites/jobSkill';
import { ToastrService } from 'ngx-toastr';
import { EmploiFormation } from 'src/app/shared/entites/EmploiFormation';
@Component({
  selector: 'app-job-step1',
  templateUrl: './job-step1.component.html',
  styleUrls: ['./job-step1.component.scss']
})
export class JobStep1Component implements OnInit {

  skill: JobSkill;
  offres: OffresEmploi;
  numberSkills: number;

  numberdiploma: number;
  diplome: EmploiFormation;
  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    this.numberSkills = 0;
    this.numberdiploma = 0;
    this.skill = new JobSkill();
    this.offres = new OffresEmploi();
    this.diplome = new EmploiFormation();
  }

  addSkill() {
    this.pushSkill();
  }
  addDiploma(){
    this.pushDiploma();
  }

  deleteSkill(i: number): void {
    this.offres.competencessup.splice(i, 1);
  }
  deleteDiploma(i: number): void {
    this.offres.competencessup.splice(i, 1);
  }

  pushSkill() {
    if (!this.offres.competencessup) {
      this.offres.competencessup = [];
    }
    const res = this.offres.competencessup.find(al => al.skillName.toUpperCase() === this.skill.skillName.toUpperCase());
    console.log(res);
    if (res) {
      this.toastr.error('skill already added', 'Error');
      return;
    }
    this.offres.competencessup.push(this.skill);
    this.skill = new JobSkill();
    this.numberSkills += 1;
    this.toastr.success('Skill added succesfully', 'Success');
  }
  pushDiploma() {
    if (!this.offres.formations) {
      this.offres.formations = [];
    }
    const res = this.offres.formations.find(al => al.nomDiplome.toUpperCase() === this.diplome.nomDiplome.toUpperCase());
    console.log(res);
    if (res) {
      this.toastr.error('Diploma already added', 'Error');
      return;
    }
    this.offres.formations.push(this.diplome);
    this.diplome = new EmploiFormation();
    this.numberdiploma += 1;
    this.toastr.success('Diploma added succesfully', 'Success');
  }

}
