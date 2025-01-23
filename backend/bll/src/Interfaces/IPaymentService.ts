export interface IPaymentService {
    /**
     * Traite un paiement sécurisé pour une commande.
     * @param commandeId - L'ID de la commande à payer.
     * @param amount - Le montant total à payer.
     * @param currency - La devise utilisée pour le paiement.
     * @returns Le client_secret pour le paiement sécurisé.
     */
    processPayment(commandeId: number, amount: number, currency: string): Promise<string>;
  
    /**
     * Valide un paiement et met à jour le statut de la commande.
     * @param commandeId - L'ID de la commande.
     */
    validatePayment(commandeId: number): Promise<void>;
  }
  