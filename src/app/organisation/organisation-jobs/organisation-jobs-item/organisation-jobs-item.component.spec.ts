import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationJobsItemComponent } from './organisation-jobs-item.component';

describe('OrganisationJobsItemComponent', () => {
  let component: OrganisationJobsItemComponent;
  let fixture: ComponentFixture<OrganisationJobsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationJobsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationJobsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
