import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationCertAskedItemComponent } from './organisation-cert-asked-item.component';

describe('OrganisationCertAskedItemComponent', () => {
  let component: OrganisationCertAskedItemComponent;
  let fixture: ComponentFixture<OrganisationCertAskedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationCertAskedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationCertAskedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
