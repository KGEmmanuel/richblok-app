import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStep4Component } from './job-step4.component';

describe('JobStep4Component', () => {
  let component: JobStep4Component;
  let fixture: ComponentFixture<JobStep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
