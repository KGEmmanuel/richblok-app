import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAccTrainComponent } from './record-acc-train.component';

describe('RecordAccTrainComponent', () => {
  let component: RecordAccTrainComponent;
  let fixture: ComponentFixture<RecordAccTrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordAccTrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAccTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
