import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJobProfileComponent } from './user-job-profile.component';

describe('UserJobProfileComponent', () => {
  let component: UserJobProfileComponent;
  let fixture: ComponentFixture<UserJobProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserJobProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserJobProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
