import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = 'https://localhost:3000/api/reviews'; // URL de base pour les avis

  constructor(private http: HttpClient) {}

  /**
   * Créer un avis
   * @param reviewData Données de l'avis
   * @returns Un observable contenant la réponse de l'API
   */
  createReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, reviewData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer les avis d'un produit ou d'un appareil
   * @param productId ID du produit ou appareil
   * @returns Un observable contenant les avis
   */
  getReviewsByProductId(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/product/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer un avis par ID
   * @param reviewId ID de l'avis
   * @returns Un observable contenant l'avis
   */
  getReviewById(reviewId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${reviewId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprimer un avis
   * @param reviewId ID de l'avis à supprimer
   * @returns Un observable contenant la réponse de l'API
   */
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reviewId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param error Erreur retournée par l'API
   * @returns Une erreur formatée pour l'utilisateur
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
