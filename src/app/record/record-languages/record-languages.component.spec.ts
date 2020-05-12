import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordLanguagesComponent } from './record-languages.component';

describe('RecordLanguagesComponent', () => {
  let component: RecordLanguagesComponent;
  let fixture: ComponentFixture<RecordLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordLanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
