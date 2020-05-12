import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordExperiencesComponent } from './record-experiences.component';

describe('RecordExperiencesComponent', () => {
  let component: RecordExperiencesComponent;
  let fixture: ComponentFixture<RecordExperiencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordExperiencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
