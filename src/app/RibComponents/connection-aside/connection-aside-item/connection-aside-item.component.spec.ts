import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionAsideItemComponent } from './connection-aside-item.component';

describe('ConnectionAsideItemComponent', () => {
  let component: ConnectionAsideItemComponent;
  let fixture: ComponentFixture<ConnectionAsideItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionAsideItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionAsideItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
