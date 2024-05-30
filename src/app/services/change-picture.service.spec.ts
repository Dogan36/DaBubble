import { TestBed } from '@angular/core/testing';

import { ChangePictureService } from './change-picture.service';

describe('ChangePictureService', () => {
  let service: ChangePictureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePictureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
