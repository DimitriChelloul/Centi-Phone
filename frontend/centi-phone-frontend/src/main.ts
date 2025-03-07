import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';
import { UserService } from './app/core/core/services/auth/user.service';
import { ReparationService } from './app/core/core/services/repairs/repair.service';
import { ProductService } from './app/core/core/services/products/product.service';
import { OrderService } from './app/core/core/services/orders/order.service';
import { PaymentService } from './app/core/core/services/payments/payment.service';
import { ReviewService } from './app/core/core/services/reviews/review.service';



bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule,BrowserAnimationsModule),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    
  ]
})