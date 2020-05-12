import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillDetailedFormComponent } from './skill-detailed-form.component';

describe('SkillDetailedFormComponent', () => {
  let component: SkillDetailedFormComponent;
  let fixture: ComponentFixture<SkillDetailedFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillDetailedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillDetailedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
