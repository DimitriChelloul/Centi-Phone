import { TestBed } from '@angular/core/testing';
import { ReparationService } from '../repairs/repair.service';
import { beforeEach, describe, it } from 'node:test';

describe('RepairService', () => {
  let service: ReparationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReparationService]
    });
    service = TestBed.get(ReparationService); 
  });

  it('should create the service', () => {
    expect(service !== undefined && service !== null).toBe(true);
  });
});



