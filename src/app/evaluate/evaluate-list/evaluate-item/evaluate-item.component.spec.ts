import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateItemComponent } from './evaluate-item.component';

describe('EvaluateItemComponent', () => {
  let component: EvaluateItemComponent;
  let fixture: ComponentFixture<EvaluateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
