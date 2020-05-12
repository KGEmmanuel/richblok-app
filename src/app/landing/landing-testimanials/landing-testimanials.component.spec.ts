import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTestimanialsComponent } from './landing-testimanials.component';

describe('LandingTestimanialsComponent', () => {
  let component: LandingTestimanialsComponent;
  let fixture: ComponentFixture<LandingTestimanialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingTestimanialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTestimanialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
