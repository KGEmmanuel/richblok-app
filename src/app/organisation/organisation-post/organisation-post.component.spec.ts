import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationPostComponent } from './organisation-post.component';

describe('OrganisationPostComponent', () => {
  let component: OrganisationPostComponent;
  let fixture: ComponentFixture<OrganisationPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
