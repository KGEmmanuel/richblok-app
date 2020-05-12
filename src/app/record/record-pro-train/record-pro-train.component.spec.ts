import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordProTrainComponent } from './record-pro-train.component';

describe('RecordProTrainComponent', () => {
  let component: RecordProTrainComponent;
  let fixture: ComponentFixture<RecordProTrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordProTrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordProTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
