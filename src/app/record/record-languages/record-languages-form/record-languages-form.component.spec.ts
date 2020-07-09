import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordLanguagesFormComponent } from './record-languages-form.component';

describe('RecordLanguagesFormComponent', () => {
  let component: RecordLanguagesFormComponent;
  let fixture: ComponentFixture<RecordLanguagesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordLanguagesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordLanguagesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
