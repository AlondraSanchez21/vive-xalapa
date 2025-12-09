import { TestBed } from '@angular/core/testing';

import { Gastronomia } from './gastronomia';

describe('Gastronomia', () => {
  let service: Gastronomia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gastronomia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
