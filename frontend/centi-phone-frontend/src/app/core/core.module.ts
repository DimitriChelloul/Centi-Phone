import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Importez simplement RouterModule

import { UserService } from '../core/core/services/auth/user.service';
import { ProductService } from '../core/core/services/products/product.service';
import { ReparationService } from '../core/core/services/repairs/repair.service';
import { ReviewService } from '../core/core/services/reviews/review.service';
import { OrderService } from '../core/core/services/orders/order.service';
import { PaymentService } from '../core/core/services/payments/payment.service';

import { JwtInterceptor } from '../core/core/interceptors/jwt.interceptor';
import { CsrfInterceptor } from './core/interceptors/csrf.interceptor';
import { HttpsInterceptor } from './core/interceptors/https.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule, // Importez simplement RouterModule
  ],
  exports: [
    RouterModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    ProductService,
    ReparationService,
    ReviewService,
    OrderService,
    PaymentService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsInterceptor,
      multi: true,
    },
  ], 
})
export class CoreModule { }