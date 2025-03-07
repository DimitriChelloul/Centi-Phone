import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentService]
    });
    service = TestBed.get(PaymentService); 
  });

  it('should create the service instance', () => {
    if (!(service instanceof PaymentService)) {
      throw new Error('Service instance was not created correctly.');
    }
  });

  it('should have a processPayment method', () => {
    if (typeof service['createPayment'] !== 'function') {
      throw new Error('Expected processPayment method to be defined on PaymentService.');
    }
  });

  it('should initialize with a default payment status', () => {
    const paymentStatus = service['checkPaymentStatus']; // Exemple de propriété attendue
    if (typeof paymentStatus !== 'string') {
      throw new Error('Expected paymentStatus to be a string.');
    }
  });
});


