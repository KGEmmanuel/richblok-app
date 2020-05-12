import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostShareFormComponent } from './post-share-form.component';

describe('PostShareFormComponent', () => {
  let component: PostShareFormComponent;
  let fixture: ComponentFixture<PostShareFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostShareFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostShareFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
