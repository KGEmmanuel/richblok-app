import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserslistInlineItemComponent } from './userslist-inline-item.component';

describe('UserslistInlineItemComponent', () => {
  let component: UserslistInlineItemComponent;
  let fixture: ComponentFixture<UserslistInlineItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserslistInlineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserslistInlineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
