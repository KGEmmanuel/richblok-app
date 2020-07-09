import { TestBed } from '@angular/core/testing';

import { ChalengeService } from './chalenge.service';

describe('ChalengeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChalengeService = TestBed.get(ChalengeService);
    expect(service).toBeTruthy();
  });
});
