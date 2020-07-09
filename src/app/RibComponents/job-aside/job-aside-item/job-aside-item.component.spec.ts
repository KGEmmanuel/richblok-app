import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAsideItemComponent } from './job-aside-item.component';

describe('JobAsideItemComponent', () => {
  let component: JobAsideItemComponent;
  let fixture: ComponentFixture<JobAsideItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAsideItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAsideItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
