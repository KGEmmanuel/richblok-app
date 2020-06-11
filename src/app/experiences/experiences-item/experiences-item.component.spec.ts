import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencesItemComponent } from './experiences-item.component';

describe('ExperiencesItemComponent', () => {
  let component: ExperiencesItemComponent;
  let fixture: ComponentFixture<ExperiencesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperiencesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperiencesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
