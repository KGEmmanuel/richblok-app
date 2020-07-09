import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsAppliedDetailsComponent } from './jobs-applied-details.component';

describe('JobsAppliedDetailsComponent', () => {
  let component: JobsAppliedDetailsComponent;
  let fixture: ComponentFixture<JobsAppliedDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAppliedDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAppliedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
