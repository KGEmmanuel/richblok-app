import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordExperiencesFormComponent } from './record-experiences-form.component';

describe('RecordExperiencesFormComponent', () => {
  let component: RecordExperiencesFormComponent;
  let fixture: ComponentFixture<RecordExperiencesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordExperiencesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordExperiencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
