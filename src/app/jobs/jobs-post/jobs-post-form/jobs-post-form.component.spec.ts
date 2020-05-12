import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsPostFormComponent } from './jobs-post-form.component';

describe('JobsPostFormComponent', () => {
  let component: JobsPostFormComponent;
  let fixture: ComponentFixture<JobsPostFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsPostFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsPostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
