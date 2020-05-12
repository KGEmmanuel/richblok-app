import { TestBed } from '@angular/core/testing';

import { DemonstrateService } from './demonstrate.service';

describe('DemonstrateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemonstrateService = TestBed.get(DemonstrateService);
    expect(service).toBeTruthy();
  });
});
