import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDocumentsComponent } from './record-documents.component';

describe('RecordDocumentsComponent', () => {
  let component: RecordDocumentsComponent;
  let fixture: ComponentFixture<RecordDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
