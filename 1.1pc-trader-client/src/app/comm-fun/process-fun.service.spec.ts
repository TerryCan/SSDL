import { TestBed, inject } from '@angular/core/testing';

import { ProcessFunService } from './process-fun.service';

describe('ProcessFunService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcessFunService]
    });
  });

  it('should be created', inject([ProcessFunService], (service: ProcessFunService) => {
    expect(service).toBeTruthy();
  }));
});
