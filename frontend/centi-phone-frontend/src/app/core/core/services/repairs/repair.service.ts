import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../auth/user.service';

@Injectable({
  providedIn: 'root',
})
export class ReparationService {
  private baseUrl = 'https://localhost:3000/api/reparations'; // URL de base pour les réparations

  constructor(private http: HttpClient,
    private userService: UserService) {}



     /**
 * Récupérer le token CSRF depuis les cookies
 */
private getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/(^| )X-CSRF-Token=([^;]+)/);
  return match ? decodeURIComponent(match[2].split("|")[0]) : null; // On récupère uniquement la première partie du token
}

  /**
   * Créer un rendez-vous de réparation
   * @param rdvData Données du rendez-vous
   * @returns Un observable contenant la réponse de l'API
   */
  createRdv(rdvData: any): Observable<any> {

    const utilisateurId = this.userService.getUserIdFromToken();
    console.log("🔹 [DEBUG] utilisateurId récupéré pour l'envoi :", utilisateurId);

    if (!rdvData.dateRdv) {
      console.error("❌ [ERROR] La date du rendez-vous est manquante !");
      return throwError(() => new Error("Date du rendez-vous manquante."));
    }
  
    // 🔹 Vérifie si la date est déjà un objet `Date`
    let dateRdv = rdvData.dateRdv instanceof Date ? rdvData.dateRdv : new Date(rdvData.dateRdv);
   
  
    if (isNaN(dateRdv.getTime())) {
      console.error("❌ [ERROR] Format de date invalide !");
      return throwError(() => new Error("Format de date invalide."));
    }
    console.log("🔹 [DEBUG] Données envoyées au serveur :", { utilisateurId,...rdvData, dateRdv });
    console.log("🔹 [DEBUG] Date envoyée au serveur :", dateRdv);
  
    return this.http.post(`${this.baseUrl}/rdv`, {utilisateurId, ...rdvData, dateRdv }, {
      headers: this.userService.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error("❌ [ERROR] Erreur lors de la prise de rendez-vous :", error);
        return throwError(() => new Error("Erreur de requête."));
      })
    );
  }
  


  /**
   * Ajouter un suivi de réparation
   * @param suiviData Données du suivi de réparation
   * @returns Un observable contenant la réponse de l'API
   */
  addSuiviReparation(suiviData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/suivi`, suiviData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mettre à jour le statut d'une réparation
   * @param statutData Données du nouveau statut de réparation
   * @returns Un observable contenant la réponse de l'API
   */
  updateStatutReparation(statutData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/statut`, statutData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Créer un devis pour une réparation
   * @param devisData Données du devis
   * @returns Un observable contenant la réponse de l'API
   */
  createDevis(devisData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/devis`, devisData).pipe(
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
