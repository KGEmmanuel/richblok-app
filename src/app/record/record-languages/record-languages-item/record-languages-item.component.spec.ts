import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordLanguagesItemComponent } from './record-languages-item.component';

describe('RecordLanguagesItemComponent', () => {
  let component: RecordLanguagesItemComponent;
  let fixture: ComponentFixture<RecordLanguagesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordLanguagesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordLanguagesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
