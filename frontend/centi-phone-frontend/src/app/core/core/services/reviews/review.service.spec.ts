import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { beforeEach, describe, it } from 'node:test';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewService]
    });
    service = TestBed.get(ReviewService); 
  });

  it('should create the service', () => {
    expect(service !== undefined && service !== null).toBe(true);
  });

  it('should be an instance of ReviewService', () => {
    expect(service instanceof ReviewService).toBe(true);
  });

  it('should have a defined method "getReviews"', () => {
    expect(typeof service.getReviewsByProductId).toBe('function');
  });
});

