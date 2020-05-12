import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCommentsItemComponent } from './post-comments-item.component';

describe('PostCommentsItemComponent', () => {
  let component: PostCommentsItemComponent;
  let fixture: ComponentFixture<PostCommentsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCommentsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCommentsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
