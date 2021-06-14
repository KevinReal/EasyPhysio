import { TestBed } from '@angular/core/testing';

import { AuthLoggedGuard } from './authLogged.guard';

describe('AuthGuard', () => {
  let guard: AuthLoggedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthLoggedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
