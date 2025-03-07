import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'https://localhost:3000/api/commandes'; // URL de base pour les commandes

  constructor(private http: HttpClient) {}

  /**
   * Créer une nouvelle commande
   * @param orderData Données de la commande
   * @returns Un observable contenant la réponse de l'API
   */
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, orderData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création de la commande :', error);
        return throwError(() => new Error('Impossible de créer la commande.'));
      })
    );
  }

  /**
   * Récupérer une commande par ID
   * @param orderId ID de la commande
   * @returns Un observable contenant les données de la commande
   */
  getOrderById(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération de la commande :', error);
        return throwError(() => new Error('Impossible de récupérer la commande.'));
      })
    );
  }

  /**
   * Récupérer toutes les commandes d'un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Un observable contenant la liste des commandes
   */
  getOrdersByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des commandes :', error);
        return throwError(() => new Error('Impossible de récupérer les commandes.'));
      })
    );
  }

  /**
   * Annuler une commande
   * @param orderId ID de la commande à annuler
   * @returns Un observable contenant la réponse de l'API
   */
  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${orderId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'annulation de la commande :', error);
        return throwError(() => new Error('Impossible d\'annuler la commande.'));
      })
    );
  }

  /**
   * Ajouter un détail à une commande
   * @param orderId ID de la commande
   * @param detailData Données des détails à ajouter
   * @returns Un observable contenant la réponse de l'API
   */
  addOrderDetail(orderId: number, detailData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orderId}/details`, detailData).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'ajout d\'un détail à la commande :', error);
        return throwError(() => new Error('Impossible d\'ajouter le détail.'));
      })
    );
  }

  /**
   * Récupérer les détails d'une commande
   * @param orderId ID de la commande
   * @returns Un observable contenant les détails de la commande
   */
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}/details`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des détails de la commande :', error);
        return throwError(() => new Error('Impossible de récupérer les détails de la commande.'));
      })
    );
  }

  /**
   * Créer une livraison pour une commande
   * @param deliveryData Données de la livraison
   * @returns Un observable contenant la réponse de l'API
   */
  createDelivery(deliveryData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/livraison`, deliveryData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création de la livraison :', error);
        return throwError(() => new Error('Impossible de créer la livraison.'));
      })
    );
  }

  /**
   * Récupérer toutes les options de livraison disponibles
   * @returns Un observable contenant la liste des options de livraison
   */
  getAllDeliveryOptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/livraison/options`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des options de livraison :', error);
        return throwError(() => new Error('Impossible de récupérer les options de livraison.'));
      })
    );
  }

  /**
   * Créer une commande et initier un paiement
   * @param orderData Données de la commande
   * @returns Un observable contenant la réponse de l'API
   */
  createOrderAndPay(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-and-pay`, orderData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création et du paiement de la commande :', error);
        return throwError(() => new Error('Impossible de créer et payer la commande.'));
      })
    );
  }

  /**
   * Valider un paiement pour une commande
   * @param paymentData Données de validation du paiement
   * @returns Un observable contenant la réponse de l'API
   */
  validatePayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/validate-payment`, paymentData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la validation du paiement :', error);
        return throwError(() => new Error('Impossible de valider le paiement.'));
      })
    );
  }
}
