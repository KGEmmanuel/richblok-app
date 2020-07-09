import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationViewJobsComponent } from './organisation-view-jobs.component';

describe('OrganisationViewJobsComponent', () => {
  let component: OrganisationViewJobsComponent;
  let fixture: ComponentFixture<OrganisationViewJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationViewJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationViewJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
