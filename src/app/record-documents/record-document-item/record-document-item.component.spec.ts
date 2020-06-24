import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDocumentItemComponent } from './record-document-item.component';

describe('RecordDocumentItemComponent', () => {
  let component: RecordDocumentItemComponent;
  let fixture: ComponentFixture<RecordDocumentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDocumentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDocumentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
