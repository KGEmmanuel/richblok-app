import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsPostComponent } from './jobs-post.component';

describe('JobsPostComponent', () => {
  let component: JobsPostComponent;
  let fixture: ComponentFixture<JobsPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
