import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { AppointmentComponent } from './pages/appointments/appointments.component';
import { TrackRepairComponent } from './pages/track-repair/track-repair.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RoleGuard } from './core/core/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'appointments', component: AppointmentComponent },
  { path: 'track-repair', component: TrackRepairComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'reviews', component: ReviewsComponent },
 
  { path: '**', redirectTo: '' },
  { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
];

// Module de routage principal
//export const AppRoutingModule = RouterModule.forRoot(routes);
