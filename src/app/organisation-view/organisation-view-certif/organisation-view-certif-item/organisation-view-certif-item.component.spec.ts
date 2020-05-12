import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationViewCertifItemComponent } from './organisation-view-certif-item.component';

describe('OrganisationViewCertifItemComponent', () => {
  let component: OrganisationViewCertifItemComponent;
  let fixture: ComponentFixture<OrganisationViewCertifItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationViewCertifItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationViewCertifItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
