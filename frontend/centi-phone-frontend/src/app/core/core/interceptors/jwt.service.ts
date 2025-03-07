import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private tokenKey = 'jwtToken'; 

  constructor() { }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); 
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Optional: Decode JWT token (if needed)
  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const payload = atob(parts[1].replace('-', '+').replace('_', '/'));
      return JSON.parse(payload);
    } catch (error) {
      return null;
    }
  }
}