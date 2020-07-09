import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAsideComponent } from './job-aside.component';

describe('JobAsideComponent', () => {
  let component: JobAsideComponent;
  let fixture: ComponentFixture<JobAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
