import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUsersItemComponent } from './chat-users-item.component';

describe('ChatUsersItemComponent', () => {
  let component: ChatUsersItemComponent;
  let fixture: ComponentFixture<ChatUsersItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatUsersItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatUsersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
