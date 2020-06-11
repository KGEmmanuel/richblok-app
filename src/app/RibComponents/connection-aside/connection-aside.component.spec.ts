import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionAsideComponent } from './connection-aside.component';

describe('ConnectionAsideComponent', () => {
  let component: ConnectionAsideComponent;
  let fixture: ComponentFixture<ConnectionAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
