import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Services
import { UserService } from './core/core/services/auth/user.service';
import { ReparationService } from './core/core/services/repairs/repair.service';
import { ProductService } from './core/core/services/products/product.service';
import { OrderService } from './core/core/services/orders/order.service';
import { PaymentService } from './core/core/services/payments/payment.service';
import { ReviewService } from './core/core/services/reviews/review.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule,FooterComponent, HeaderComponent],
  template: `<app-header></app-header><main><<router-outlet></router-outlet></main><app-footer></app-footer>`,
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private reparationService: ReparationService,
    private productService: ProductService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private reviewService: ReviewService,
    
  ) {
    
      console.log('Exécution côté client');
    
  }

  ngOnInit(): void {
    
      //this.userService.getCsrfToken();
    
  }
}