import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://localhost:3000/api/utilisateurs';
  private tokenKey = 'jwtToken';
  private csrfTokenKey = 'csrfToken';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenAvailable());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) 
  {this.getCsrfTokenFromCookie();}



  /**
   * Récupérer le token JWT stocké
   */
  getJwtToken(): string | null {
    
    console.log("Récupération du JWT Token :", localStorage.getItem(this.tokenKey));
      return localStorage.getItem(this.tokenKey);
    
    
  }

  /**
   * Stocker le token JWT après connexion
   */
  setJwtToken(token: string): void {
   
    console.log("Stockage du JWT Token :", token);
      localStorage.setItem(this.tokenKey, token);
      this.isAuthenticatedSubject.next(true);
    
  }

  /**
   * Supprimer le token JWT lors de la déconnexion
   */
  removeJwtToken(): void {
    
      localStorage.removeItem(this.tokenKey);
      this.isAuthenticatedSubject.next(false);
    
  }

  /**
   * Vérifie si le token est disponible et valide
   */
  isTokenAvailable(): boolean {
    const token = this.getJwtToken();
    if (!token) return false;

    try {
      const payload = this.decodeJwtToken(token);
      return payload && payload.exp * 1000 > Date.now(); // Vérifie expiration
    } catch (error) {
      return false;
    }
  }

  /**
   * Décoder le token JWT pour récupérer les informations utilisateur
   */
  decodeJwtToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Erreur lors du décodage du token JWT', error);
      return null;
    }
  }

 /**
 * Récupérer et stocker le token CSRF
 */
 getCsrfToken(): void {
  this.http.get<{ csrfToken: string }>('https://localhost:3000/csrf-token', { 
    withCredentials: true 
  }).subscribe({
    next: (response) => {
      console.log('[DEBUG] CSRF Token reçu depuis la réponse JSON:', response.csrfToken);
      document.cookie = `X-CSRF-Token=${response.csrfToken}; path=/`; // ✅ Stockage en cookie
    },
    error: (err) => {
      console.error('[ERROR] Erreur lors de la récupération du token CSRF', err);
    }
  });
}




  /**
 * Récupérer le token CSRF depuis les cookies
 */
  getCsrfTokenFromCookie(): string | null {
    const match = document.cookie.match(/(^| )X-CSRF-Token=([^;]+)/);
    if (match) {
      const fullToken = decodeURIComponent(match[2]);
      const csrfToken = fullToken.split("|")[0];  // 🔹 Prendre uniquement la première partie du token
      console.log("🔹 [DEBUG] CSRF Token extrait et formaté :", csrfToken);
      return csrfToken;
    }
    console.error("❌ [ERROR] CSRF Token introuvable dans les cookies !");
    return null;
  }

  getAuthHeaders(): HttpHeaders {
    const jwtToken = this.getJwtToken();
    const csrfToken = this.getCsrfTokenFromCookie();
  
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  
    if (csrfToken) {
      headers = headers.set("x-csrf-Token", csrfToken);
    }
  
    if (jwtToken) {
      headers = headers.set("Authorization", `Bearer ${jwtToken}`);
    }
  
    return headers;
  }

  getUserIdFromToken(): number | null {
    const token = this.getJwtToken();
    if (!token) return null;
  
    try {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1])); // Décode le JWT
      return decodedToken.userId;  // ✅ Retourne `userId`
    } catch (error) {
      console.error("❌ [ERROR] Impossible de décoder le JWT :", error);
      return null;
    }
  }
  

  /**
   * 
   * 
   * Connexion utilisateur
   */
  login(credentials: { email: string; motDePasse: string }): Observable<any> {
    // Plus besoin de gérer le token CSRF pour login
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      map((response) => {
        if (response.token) {
          console.log("[DEBUG] Token JWT reçu :", response.token);
          this.setJwtToken(response.token);
        }
        return response;
      }),
      catchError((error) => {
        console.error('Erreur lors de la connexion :', error);
        return throwError(() => new Error('Échec de la connexion.'));
      })
    );
  }
  
  register(userData: { nom: string; prenom: string; email: string; motDePasse: string; role?: string; }, csrfToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData, {
      headers: new HttpHeaders({ 'X-CSRF-Token': csrfToken }),
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.error("Erreur lors de l'inscription :", error);
        return throwError(() => new Error("Échec de l'inscription."));
      })
    );
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): void {
    this.removeJwtToken();
    
      localStorage.removeItem(this.csrfTokenKey);
    
    this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => console.log('Déconnecté avec succès'),
      error: (err) => console.error('Erreur lors de la déconnexion', err),
    });
  }

  /**
   * Récupérer le profil utilisateur
   */
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        return throwError(() => new Error("Impossible de récupérer le profil utilisateur."));
      })
    );
  }

  /**
   * Mettre à jour les informations utilisateur
   */
  updateUser(userId: number, updatedData: Partial<any>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}`, updatedData).pipe(
      catchError((error) => {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        return throwError(() => new Error('Échec de la mise à jour.'));
      })
    );
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        return throwError(() => new Error('Échec de la suppression.'));
      })
    );
  }

  /**
   * Récupérer le rôle utilisateur depuis le token JWT
   */
  getUserRole(): string | null {
    const token = this.getJwtToken();
    if (!token) return null;
    const payload = this.decodeJwtToken(token);
    return payload?.role || null;
  }
}
