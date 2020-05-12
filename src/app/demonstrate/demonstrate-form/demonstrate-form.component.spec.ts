import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemonstrateFormComponent } from './demonstrate-form.component';

describe('DemonstrateFormComponent', () => {
  let component: DemonstrateFormComponent;
  let fixture: ComponentFixture<DemonstrateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemonstrateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemonstrateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
