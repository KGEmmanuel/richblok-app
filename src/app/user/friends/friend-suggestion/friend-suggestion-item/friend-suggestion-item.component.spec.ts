import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendSuggestionItemComponent } from './friend-suggestion-item.component';

describe('FriendSuggestionItemComponent', () => {
  let component: FriendSuggestionItemComponent;
  let fixture: ComponentFixture<FriendSuggestionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendSuggestionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendSuggestionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
