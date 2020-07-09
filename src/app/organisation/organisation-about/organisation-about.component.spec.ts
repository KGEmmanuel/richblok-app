import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAboutComponent } from './organisation-about.component';

describe('OrganisationAboutComponent', () => {
  let component: OrganisationAboutComponent;
  let fixture: ComponentFixture<OrganisationAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
