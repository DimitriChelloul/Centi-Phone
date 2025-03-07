import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HttpsInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vérifiez si le code s'exécute côté navigateur
    
      // Vérifiez si l'URL est en HTTP, redirigez-la en HTTPS
      if (req.url.startsWith('http://')) {
        const httpsReq = req.clone({ url: req.url.replace('http://', 'https://') });
        return next.handle(httpsReq);
      }
    
    
    return next.handle(req);
  }
}
