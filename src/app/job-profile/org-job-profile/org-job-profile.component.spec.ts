import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgJobProfileComponent } from './org-job-profile.component';

describe('OrgJobProfileComponent', () => {
  let component: OrgJobProfileComponent;
  let fixture: ComponentFixture<OrgJobProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgJobProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgJobProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
