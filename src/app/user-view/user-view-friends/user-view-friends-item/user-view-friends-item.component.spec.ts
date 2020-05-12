import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewFriendsItemComponent } from './user-view-friends-item.component';

describe('UserViewFriendsItemComponent', () => {
  let component: UserViewFriendsItemComponent;
  let fixture: ComponentFixture<UserViewFriendsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserViewFriendsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewFriendsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
