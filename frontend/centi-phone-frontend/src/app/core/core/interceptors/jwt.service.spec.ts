import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtService]
    });
    service = TestBed.get(JwtService);  // Utilisation de get au lieu de inject
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
