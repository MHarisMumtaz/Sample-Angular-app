import { TestBed, inject } from '@angular/core/testing';

import { OktaTokenService } from './okta-token.service';

describe('OktaTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OktaTokenService]
    });
  });

  it('should be created', inject([OktaTokenService], (service: OktaTokenService) => {
    expect(service).toBeTruthy();
  }));
});
