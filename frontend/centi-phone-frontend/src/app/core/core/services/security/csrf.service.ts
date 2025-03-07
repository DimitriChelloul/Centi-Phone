import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  constructor(private http: HttpClient) {}

  // Appel API pour récupérer le token CSRF avant une requête
  getCsrfToken() {
    return this.http.get<{ csrfToken: string }>('https://localhost:3000/csrf-token', { withCredentials: true });
  }
}
