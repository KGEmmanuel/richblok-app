import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostItemDetailComponent } from './post-item-detail.component';

describe('PostItemDetailComponent', () => {
  let component: PostItemDetailComponent;
  let fixture: ComponentFixture<PostItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
