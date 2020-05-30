import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowOrgsComponent } from './follow-orgs.component';

describe('FollowOrgsComponent', () => {
  let component: FollowOrgsComponent;
  let fixture: ComponentFixture<FollowOrgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowOrgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowOrgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
