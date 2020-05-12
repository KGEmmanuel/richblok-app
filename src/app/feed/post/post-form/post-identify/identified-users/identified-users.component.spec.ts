import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiedUsersComponent } from './identified-users.component';

describe('IdentifiedUsersComponent', () => {
  let component: IdentifiedUsersComponent;
  let fixture: ComponentFixture<IdentifiedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifiedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifiedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
