import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateOwnerComponent } from './evaluate-owner.component';

describe('EvaluateOwnerComponent', () => {
  let component: EvaluateOwnerComponent;
  let fixture: ComponentFixture<EvaluateOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
