import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationCertificationAskedComponent } from './organisation-certification-asked.component';

describe('OrganisationCertificationAskedComponent', () => {
  let component: OrganisationCertificationAskedComponent;
  let fixture: ComponentFixture<OrganisationCertificationAskedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationCertificationAskedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationCertificationAskedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
