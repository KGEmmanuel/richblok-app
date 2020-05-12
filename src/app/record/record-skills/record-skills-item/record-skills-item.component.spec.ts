import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSkillsItemComponent } from './record-skills-item.component';

describe('RecordSkillsItemComponent', () => {
  let component: RecordSkillsItemComponent;
  let fixture: ComponentFixture<RecordSkillsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordSkillsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSkillsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
