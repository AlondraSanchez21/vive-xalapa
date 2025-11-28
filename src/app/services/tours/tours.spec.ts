import { TestBed } from '@angular/core/testing';

import { Tours } from './tours';

describe('Tours', () => {
  let service: Tours;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tours);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
