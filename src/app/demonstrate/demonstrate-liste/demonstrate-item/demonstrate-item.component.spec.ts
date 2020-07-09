import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemonstrateItemComponent } from './demonstrate-item.component';

describe('DemonstrateItemComponent', () => {
  let component: DemonstrateItemComponent;
  let fixture: ComponentFixture<DemonstrateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemonstrateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemonstrateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
