import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendInvitationComponent } from './friend-invitation.component';

describe('FriendInvitationComponent', () => {
  let component: FriendInvitationComponent;
  let fixture: ComponentFixture<FriendInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
