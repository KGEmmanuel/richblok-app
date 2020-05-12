import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordProTrainFormComponent } from './record-pro-train-form.component';

describe('RecordProTrainFormComponent', () => {
  let component: RecordProTrainFormComponent;
  let fixture: ComponentFixture<RecordProTrainFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordProTrainFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordProTrainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
