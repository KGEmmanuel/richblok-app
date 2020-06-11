import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitchatComponent } from './initchat.component';

describe('InitchatComponent', () => {
  let component: InitchatComponent;
  let fixture: ComponentFixture<InitchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
