import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsAppliedItemComponent } from './jobs-applied-item.component';

describe('JobsAppliedItemComponent', () => {
  let component: JobsAppliedItemComponent;
  let fixture: ComponentFixture<JobsAppliedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAppliedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAppliedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
