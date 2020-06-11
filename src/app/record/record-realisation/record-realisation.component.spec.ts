import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordRealisationComponent } from './record-realisation.component';

describe('RecordRealisationComponent', () => {
  let component: RecordRealisationComponent;
  let fixture: ComponentFixture<RecordRealisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordRealisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordRealisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
