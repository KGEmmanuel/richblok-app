import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationCertificationApprouvedComponent } from './organisation-certification-approuved.component';

describe('OrganisationCertificationApprouvedComponent', () => {
  let component: OrganisationCertificationApprouvedComponent;
  let fixture: ComponentFixture<OrganisationCertificationApprouvedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationCertificationApprouvedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationCertificationApprouvedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
