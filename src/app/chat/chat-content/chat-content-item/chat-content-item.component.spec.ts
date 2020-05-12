import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContentItemComponent } from './chat-content-item.component';

describe('ChatContentItemComponent', () => {
  let component: ChatContentItemComponent;
  let fixture: ComponentFixture<ChatContentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
