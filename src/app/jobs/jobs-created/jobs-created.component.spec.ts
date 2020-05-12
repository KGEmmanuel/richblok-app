import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsCreatedComponent } from './jobs-created.component';

describe('JobsCreatedComponent', () => {
  let component: JobsCreatedComponent;
  let fixture: ComponentFixture<JobsCreatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsCreatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
