import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiedUsersItemComponent } from './identified-users-item.component';

describe('IdentifiedUsersItemComponent', () => {
  let component: IdentifiedUsersItemComponent;
  let fixture: ComponentFixture<IdentifiedUsersItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifiedUsersItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifiedUsersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
