import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationCertAprouvedItemComponent } from './organisation-cert-aprouved-item.component';

describe('OrganisationCertAprouvedItemComponent', () => {
  let component: OrganisationCertAprouvedItemComponent;
  let fixture: ComponentFixture<OrganisationCertAprouvedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationCertAprouvedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationCertAprouvedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
