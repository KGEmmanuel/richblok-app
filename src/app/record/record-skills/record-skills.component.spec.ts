import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSkillsComponent } from './record-skills.component';

describe('RecordSkillsComponent', () => {
  let component: RecordSkillsComponent;
  let fixture: ComponentFixture<RecordSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
