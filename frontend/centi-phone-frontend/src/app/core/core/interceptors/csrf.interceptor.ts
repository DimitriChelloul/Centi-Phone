import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/auth/user.service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.getCsrfTokenFromCookie()?.split('|')[0]; // ✅ Extrait seulement la partie nécessaire
  
    if (csrfToken) {
      req = req.clone({
        setHeaders: { 'X-CSRF-Token': csrfToken }
      });
    }
  
    return next.handle(req);
  }

  /**
   * Récupérer le token CSRF depuis les cookies
   */
  private getCsrfTokenFromCookie(): string | null {
    const match = document.cookie.match(/(^| )X-CSRF-Token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  }
}


