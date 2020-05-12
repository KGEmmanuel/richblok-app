import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSkillsFormComponent } from './record-skills-form.component';

describe('RecordSkillsFormComponent', () => {
  let component: RecordSkillsFormComponent;
  let fixture: ComponentFixture<RecordSkillsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordSkillsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSkillsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
