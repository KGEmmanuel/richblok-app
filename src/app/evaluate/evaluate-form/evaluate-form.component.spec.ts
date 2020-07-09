import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateFormComponent } from './evaluate-form.component';

describe('EvaluateFormComponent', () => {
  let component: EvaluateFormComponent;
  let fixture: ComponentFixture<EvaluateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
