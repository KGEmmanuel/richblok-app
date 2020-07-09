import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStep1Component } from './job-step1.component';

describe('JobStep1Component', () => {
  let component: JobStep1Component;
  let fixture: ComponentFixture<JobStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
