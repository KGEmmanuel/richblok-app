import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCommentsFormComponent } from './post-comments-form.component';

describe('PostCommentsFormComponent', () => {
  let component: PostCommentsFormComponent;
  let fixture: ComponentFixture<PostCommentsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCommentsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCommentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
