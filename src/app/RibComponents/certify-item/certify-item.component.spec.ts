import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifyItemComponent } from './certify-item.component';

describe('CertifyItemComponent', () => {
  let component: CertifyItemComponent;
  let fixture: ComponentFixture<CertifyItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertifyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertifyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
