import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStep5Component } from './job-step5.component';

describe('JobStep5Component', () => {
  let component: JobStep5Component;
  let fixture: ComponentFixture<JobStep5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStep5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
