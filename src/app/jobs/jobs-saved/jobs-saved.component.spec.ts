import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsSavedComponent } from './jobs-saved.component';

describe('JobsSavedComponent', () => {
  let component: JobsSavedComponent;
  let fixture: ComponentFixture<JobsSavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsSavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
