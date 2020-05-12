import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemonstrateSuggestionComponent } from './demonstrate-suggestion.component';

describe('DemonstrateSuggestionComponent', () => {
  let component: DemonstrateSuggestionComponent;
  let fixture: ComponentFixture<DemonstrateSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemonstrateSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemonstrateSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
