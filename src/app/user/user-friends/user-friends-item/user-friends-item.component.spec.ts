import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFriendsItemComponent } from './user-friends-item.component';

describe('UserFriendsItemComponent', () => {
  let component: UserFriendsItemComponent;
  let fixture: ComponentFixture<UserFriendsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFriendsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFriendsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
