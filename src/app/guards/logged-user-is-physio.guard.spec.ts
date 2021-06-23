import { TestBed } from '@angular/core/testing';

import { LoggedUserIsPhysioGuard } from './logged-user-is-physio.guard';

describe('LoggedUserIsPhysioGuard', () => {
  let guard: LoggedUserIsPhysioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedUserIsPhysioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
