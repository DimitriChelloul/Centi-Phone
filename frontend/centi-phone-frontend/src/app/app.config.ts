import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CsrfInterceptor } from './core/core/interceptors/csrf.interceptor';
import { JwtInterceptor } from './core/core/interceptors/jwt.interceptor';
import { HttpsInterceptor } from './core/core/interceptors/https.interceptor';
import { CoreModule } from './core/core.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (request, next) => {
          // Log pour le debugging
          console.log('Request intercepted:', request);
          return next(request);
        }
      ])
    ),
    provideAnimations(),
    importProvidersFrom(CoreModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsInterceptor,
      multi: true
    }
  ]
};