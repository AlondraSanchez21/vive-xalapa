import { TestBed } from '@angular/core/testing';

import { Hoteles } from './hoteles';

describe('Hoteles', () => {
  let service: Hoteles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hoteles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
