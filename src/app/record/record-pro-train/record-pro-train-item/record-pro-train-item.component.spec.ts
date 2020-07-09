import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordProTrainItemComponent } from './record-pro-train-item.component';

describe('RecordProTrainItemComponent', () => {
  let component: RecordProTrainItemComponent;
  let fixture: ComponentFixture<RecordProTrainItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordProTrainItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordProTrainItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
