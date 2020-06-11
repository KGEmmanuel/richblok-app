import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsItemComponent } from './friends-item.component';

describe('FriendsItemComponent', () => {
  let component: FriendsItemComponent;
  let fixture: ComponentFixture<FriendsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
