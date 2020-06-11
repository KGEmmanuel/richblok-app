import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordRealisationFormComponent } from './record-realisation-form.component';

describe('RecordRealisationFormComponent', () => {
  let component: RecordRealisationFormComponent;
  let fixture: ComponentFixture<RecordRealisationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordRealisationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordRealisationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
