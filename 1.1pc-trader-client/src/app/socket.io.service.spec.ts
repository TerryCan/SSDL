import { TestBed, inject } from '@angular/core/testing';

import { SocketIoService } from './socket.io.service';

describe('Socket.IoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketIoService]
    });
  });

  it('should be created', inject([SocketIoService], (service: SocketIoService) => {
    expect(service).toBeTruthy();
  }));
});
