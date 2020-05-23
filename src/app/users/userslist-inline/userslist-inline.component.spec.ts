import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserslistInlineComponent } from './userslist-inline.component';

describe('UserslistInlineComponent', () => {
  let component: UserslistInlineComponent;
  let fixture: ComponentFixture<UserslistInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserslistInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserslistInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
