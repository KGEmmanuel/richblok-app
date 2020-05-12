import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateSuggestionComponent } from './evaluate-suggestion.component';

describe('EvaluateSuggestionComponent', () => {
  let component: EvaluateSuggestionComponent;
  let fixture: ComponentFixture<EvaluateSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
