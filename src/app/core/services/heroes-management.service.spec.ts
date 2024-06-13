import { TestBed } from '@angular/core/testing';

import { HeroesManagementService } from './heroes-management.service';

describe('HeroesManagementService', () => {
  let service: HeroesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
