import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncitationItemComponent } from './incitation-item.component';

describe('IncitationItemComponent', () => {
  let component: IncitationItemComponent;
  let fixture: ComponentFixture<IncitationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncitationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncitationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
