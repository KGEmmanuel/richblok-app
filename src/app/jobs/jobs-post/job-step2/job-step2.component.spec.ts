import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStep2Component } from './job-step2.component';

describe('JobStep2Component', () => {
  let component: JobStep2Component;
  let fixture: ComponentFixture<JobStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
