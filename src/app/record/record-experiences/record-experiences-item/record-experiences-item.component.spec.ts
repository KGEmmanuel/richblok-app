import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordExperiencesItemComponent } from './record-experiences-item.component';

describe('RecordExperiencesItemComponent', () => {
  let component: RecordExperiencesItemComponent;
  let fixture: ComponentFixture<RecordExperiencesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordExperiencesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordExperiencesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
