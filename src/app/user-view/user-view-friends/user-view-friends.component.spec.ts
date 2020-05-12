import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewFriendsComponent } from './user-view-friends.component';

describe('UserViewFriendsComponent', () => {
  let component: UserViewFriendsComponent;
  let fixture: ComponentFixture<UserViewFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserViewFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
