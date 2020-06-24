import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDocumentFormComponent } from './record-document-form.component';

describe('RecordDocumentFormComponent', () => {
  let component: RecordDocumentFormComponent;
  let fixture: ComponentFixture<RecordDocumentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDocumentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
