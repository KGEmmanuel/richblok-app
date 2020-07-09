import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationPostItemComponent } from './organisation-post-item.component';

describe('OrganisationPostItemComponent', () => {
  let component: OrganisationPostItemComponent;
  let fixture: ComponentFixture<OrganisationPostItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationPostItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationPostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
