import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarPagesComponent } from './similar-pages.component';

describe('SimilarPagesComponent', () => {
  let component: SimilarPagesComponent;
  let fixture: ComponentFixture<SimilarPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
