import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationJobsComponent } from './organisation-jobs.component';

describe('OrganisationJobsComponent', () => {
  let component: OrganisationJobsComponent;
  let fixture: ComponentFixture<OrganisationJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
