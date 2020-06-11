import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPostItemComponent } from './user-post-item.component';

describe('UserPostItemComponent', () => {
  let component: UserPostItemComponent;
  let fixture: ComponentFixture<UserPostItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPostItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
