import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });
    service = TestBed.get(ProductService); 
  });

  it('should create the service instance', () => {
    if (!(service instanceof ProductService)) {
      throw new Error('Service instance was not created correctly.');
    }
  });

  it('should have a function named getProductList', () => {
    if (typeof service['getAllProducts'] !== 'function') {
      throw new Error('Expected getProductList method to be defined on ProductService.');
    }
  });


});


