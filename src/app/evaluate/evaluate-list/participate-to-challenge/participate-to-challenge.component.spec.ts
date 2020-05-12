import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipateToChallengeComponent } from './participate-to-challenge.component';

describe('ParticipateToChallengeComponent', () => {
  let component: ParticipateToChallengeComponent;
  let fixture: ComponentFixture<ParticipateToChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipateToChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipateToChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
