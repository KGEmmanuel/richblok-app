import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordRealisationDetailsComponent } from './record-realisation-details.component';

describe('RecordRealisationDetailsComponent', () => {
  let component: RecordRealisationDetailsComponent;
  let fixture: ComponentFixture<RecordRealisationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordRealisationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordRealisationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
