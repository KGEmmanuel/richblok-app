import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationViewJobsItemComponent } from './organisation-view-jobs-item.component';

describe('OrganisationViewJobsItemComponent', () => {
  let component: OrganisationViewJobsItemComponent;
  let fixture: ComponentFixture<OrganisationViewJobsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationViewJobsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationViewJobsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
