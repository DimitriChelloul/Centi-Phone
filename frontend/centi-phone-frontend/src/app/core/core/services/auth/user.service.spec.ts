import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
    service = TestBed.get(UserService); // Utilisation de get au lieu de inject
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

