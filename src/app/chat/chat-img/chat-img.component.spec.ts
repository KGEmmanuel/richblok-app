import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatImgComponent } from './chat-img.component';

describe('ChatImgComponent', () => {
  let component: ChatImgComponent;
  let fixture: ComponentFixture<ChatImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
