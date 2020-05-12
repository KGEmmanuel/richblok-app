import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStep3Component } from './job-step3.component';

describe('JobStep3Component', () => {
  let component: JobStep3Component;
  let fixture: ComponentFixture<JobStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
