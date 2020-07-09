import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAccTrainItemComponent } from './record-acc-train-item.component';

describe('RecordAccTrainItemComponent', () => {
  let component: RecordAccTrainItemComponent;
  let fixture: ComponentFixture<RecordAccTrainItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordAccTrainItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAccTrainItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
