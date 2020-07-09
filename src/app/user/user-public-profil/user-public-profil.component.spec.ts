import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicProfilComponent } from './user-public-profil.component';

describe('UserPublicProfilComponent', () => {
  let component: UserPublicProfilComponent;
  let fixture: ComponentFixture<UserPublicProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPublicProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublicProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
