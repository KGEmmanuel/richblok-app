import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewedProfileItemComponent } from './viewed-profile-item.component';

describe('ViewedProfileItemComponent', () => {
  let component: ViewedProfileItemComponent;
  let fixture: ComponentFixture<ViewedProfileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewedProfileItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewedProfileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
