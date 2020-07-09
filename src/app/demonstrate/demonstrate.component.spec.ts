import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemonstrateComponent } from './demonstrate.component';

describe('DemonstrateComponent', () => {
  let component: DemonstrateComponent;
  let fixture: ComponentFixture<DemonstrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemonstrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemonstrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
