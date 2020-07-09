import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendInvitationItemComponent } from './friend-invitation-item.component';

describe('FriendInvitationItemComponent', () => {
  let component: FriendInvitationItemComponent;
  let fixture: ComponentFixture<FriendInvitationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendInvitationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendInvitationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
