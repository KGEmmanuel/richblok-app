import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemonstrateDashboardComponent } from './demonstrate-dashboard.component';

describe('DemonstrateDashboardComponent', () => {
  let component: DemonstrateDashboardComponent;
  let fixture: ComponentFixture<DemonstrateDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemonstrateDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemonstrateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
