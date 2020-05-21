import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordRealisationItemComponent } from './record-realisation-item.component';

describe('RecordRealisationItemComponent', () => {
  let component: RecordRealisationItemComponent;
  let fixture: ComponentFixture<RecordRealisationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordRealisationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordRealisationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
