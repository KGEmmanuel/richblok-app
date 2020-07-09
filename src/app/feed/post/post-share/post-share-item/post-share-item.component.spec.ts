import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostShareItemComponent } from './post-share-item.component';

describe('PostShareItemComponent', () => {
  let component: PostShareItemComponent;
  let fixture: ComponentFixture<PostShareItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostShareItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostShareItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
