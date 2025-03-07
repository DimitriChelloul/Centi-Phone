import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://localhost:3000/api/produits'; // URL de base pour les produits

  constructor(private http: HttpClient) {}


  private getCsrfToken(): string | null {
    const match = document.cookie.match(/(^| )X-CSRF-Token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  }

  
/**
 * Récupérer le token CSRF depuis les cookies
 */
private getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/(^| )X-CSRF-Token=([^;]+)/);
  return match ? decodeURIComponent(match[2].split("|")[0]) : null;
}

getAllProducts(): Observable<any> {
  console.log('🔹 [DEBUG] Appel getAllProducts');
  return this.http.get(`${this.baseUrl}/produits`, {
    withCredentials: true
  }).pipe(
    tap(response => console.log('✅ Produits récupérés:', response)),
    catchError(this.handleError2)
  );
}

getAllRefurbishedDevices(): Observable<any> {
  console.log('🔹 [DEBUG] Appel getAllRefurbishedDevices');
  return this.http.get(`${this.baseUrl}/appareilsreconditionnes`, {
    withCredentials: true
  }).pipe(
    tap(response => console.log('✅ Appareils reconditionnés récupérés:', response)),
    catchError(this.handleError2)
  );
}

private handleError2(error: HttpErrorResponse) {
  console.error('🚨 Erreur HTTP:', error);
  let message = 'Une erreur est survenue.';
  
  if (error.status === 401) {
    message = 'Accès non autorisé.';
  }

  return throwError(() => new Error(message));
}

  /**
   * Ajouter un nouveau produit
   * @param productData Données du produit à ajouter (inclut l'image dans un `FormData`)
   * @returns Un observable contenant le produit ajouté
   */
  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/produits`, productData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Ajouter un appareil reconditionné
   * @param deviceData Données de l'appareil reconditionné (inclut l'image dans un `FormData`)
   * @returns Un observable contenant l'appareil ajouté
   */
  addRefurbishedDevice(deviceData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/appareils-reconditionnes`, deviceData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mettre à jour le stock d'un produit
   * @param stockData Données du stock à mettre à jour
   * @returns Un observable contenant la réponse de l'API
   */
  updateStock(stockData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/produits/stock/`, stockData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprimer un produit
   * @param productId ID du produit à supprimer
   * @returns Un observable contenant la réponse de l'API
   */
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/produits/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprimer un appareil reconditionné
   * @param deviceId ID de l'appareil reconditionné à supprimer
   * @returns Un observable contenant la réponse de l'API
   */
  deleteRefurbishedDevice(deviceId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/appareils-reconditionnes/${deviceId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Uploader une image pour un produit
   * @param imageData Données de l'image dans un `FormData`
   * @returns Un observable contenant la réponse de l'API
   */
  uploadProductImage(imageData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-image`, imageData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Uploader une image pour un appareil reconditionné
   * @param imageData Données de l'image dans un `FormData`
   * @returns Un observable contenant la réponse de l'API
   */
  uploadRefurbishedImage(imageData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-reconditionneimage`, imageData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestion des erreurs HTTP
   * @param error Erreur retournée par l'API
   * @returns Une erreur formatée et compréhensible
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Erreur côté client :', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(`Erreur côté serveur (Code ${error.status}) :`, error.message);
    }
    return throwError(() => new Error('Une erreur est survenue lors de la communication avec l\'API. Veuillez réessayer plus tard.'));
  }
}
