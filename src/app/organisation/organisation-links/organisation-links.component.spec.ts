import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationLinksComponent } from './organisation-links.component';

describe('OrganisationLinksComponent', () => {
  let component: OrganisationLinksComponent;
  let fixture: ComponentFixture<OrganisationLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
