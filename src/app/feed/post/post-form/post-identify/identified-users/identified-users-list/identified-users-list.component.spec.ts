import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiedUsersListComponent } from './identified-users-list.component';

describe('IdentifiedUsersListComponent', () => {
  let component: IdentifiedUsersListComponent;
  let fixture: ComponentFixture<IdentifiedUsersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifiedUsersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifiedUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
