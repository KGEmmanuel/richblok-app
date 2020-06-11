import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostIdentifyComponent } from './post-identify.component';

describe('PostIdentifyComponent', () => {
  let component: PostIdentifyComponent;
  let fixture: ComponentFixture<PostIdentifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostIdentifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostIdentifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
