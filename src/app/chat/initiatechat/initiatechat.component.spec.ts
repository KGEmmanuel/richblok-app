import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatechatComponent } from './initiatechat.component';

describe('InitiatechatComponent', () => {
  let component: InitiatechatComponent;
  let fixture: ComponentFixture<InitiatechatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiatechatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
