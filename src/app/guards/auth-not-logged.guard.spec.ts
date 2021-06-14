import { TestBed } from '@angular/core/testing';

import { AuthNotLoggedGuard } from './auth-not-logged.guard';

describe('AuthNotLoggedGuard', () => {
  let guard: AuthNotLoggedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNotLoggedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
