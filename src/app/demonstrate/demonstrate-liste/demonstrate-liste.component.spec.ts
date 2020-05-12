import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemonstrateListeComponent } from './demonstrate-liste.component';

describe('DemonstrateListeComponent', () => {
  let component: DemonstrateListeComponent;
  let fixture: ComponentFixture<DemonstrateListeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemonstrateListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemonstrateListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
