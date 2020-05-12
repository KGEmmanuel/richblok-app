import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RibSolutionsComponent } from './rib-solutions.component';

describe('RibSolutionsComponent', () => {
  let component: RibSolutionsComponent;
  let fixture: ComponentFixture<RibSolutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RibSolutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RibSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
