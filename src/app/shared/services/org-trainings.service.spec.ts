import { TestBed } from '@angular/core/testing';

import { OrgTrainingsService } from './org-trainings.service';

describe('OrgTrainingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgTrainingsService = TestBed.get(OrgTrainingsService);
    expect(service).toBeTruthy();
  });
});
