import { TestBed } from '@angular/core/testing';

import { FormatUrlsService } from './format-urls.service';

describe('FormatUrlsService', () => {
  let service: FormatUrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatUrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
