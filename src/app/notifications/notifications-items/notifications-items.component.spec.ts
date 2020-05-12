import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsItemsComponent } from './notifications-items.component';

describe('NotificationsItemsComponent', () => {
  let component: NotificationsItemsComponent;
  let fixture: ComponentFixture<NotificationsItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
