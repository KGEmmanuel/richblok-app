import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAccTrainFormComponent } from './record-acc-train-form.component';

describe('RecordAccTrainFormComponent', () => {
  let component: RecordAccTrainFormComponent;
  let fixture: ComponentFixture<RecordAccTrainFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordAccTrainFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAccTrainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
