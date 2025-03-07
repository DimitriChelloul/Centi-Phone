import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService]
    });
    service = TestBed.get(OrderService); // Remplace inject par get
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
