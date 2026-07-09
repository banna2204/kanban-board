import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authorisedGuard } from './authorised.guard';

describe('authorisedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authorisedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
