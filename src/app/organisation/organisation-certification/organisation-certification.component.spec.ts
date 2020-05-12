import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationCertificationComponent } from './organisation-certification.component';

describe('OrganisationCertificationComponent', () => {
  let component: OrganisationCertificationComponent;
  let fixture: ComponentFixture<OrganisationCertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationCertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
