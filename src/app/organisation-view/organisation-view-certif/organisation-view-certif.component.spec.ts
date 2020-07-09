import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationViewCertifComponent } from './organisation-view-certif.component';

describe('OrganisationViewCertifComponent', () => {
  let component: OrganisationViewCertifComponent;
  let fixture: ComponentFixture<OrganisationViewCertifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationViewCertifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationViewCertifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
