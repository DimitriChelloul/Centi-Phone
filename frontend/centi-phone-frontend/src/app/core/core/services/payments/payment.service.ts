import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'https://localhost:3000/api/paiement'; // URL de base pour les paiements

  constructor(private http: HttpClient) {}

  /**
   * Créer un paiement
   * @param paymentData Données du paiement (montant, devise, etc.)
   * @returns Un observable contenant la réponse de l'API
   */
  createPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-payment`, paymentData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du paiement :', error);
        return throwError(() => new Error('Impossible de créer le paiement.'));
      })
    );
  }

  /**
   * Valider un paiement
   * @param validationData Données nécessaires pour valider le paiement
   * @returns Un observable contenant la réponse de l'API
   */
  validatePayment(validationData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/validate-payment`, validationData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la validation du paiement :', error);
        return throwError(() => new Error('Impossible de valider le paiement.'));
      })
    );
  }

  /**
   * Vérifier le statut d'un paiement
   * @param paymentId Identifiant unique du paiement
   * @returns Un observable contenant les détails du paiement
   */
  checkPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/status/${paymentId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la vérification du statut du paiement :', error);
        return throwError(() => new Error('Impossible de vérifier le statut du paiement.'));
      })
    );
  }
}
