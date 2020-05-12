import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAnswersFormComponent } from './evaluate-answers-form.component';

describe('EvaluateAnswersFormComponent', () => {
  let component: EvaluateAnswersFormComponent;
  let fixture: ComponentFixture<EvaluateAnswersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateAnswersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAnswersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
