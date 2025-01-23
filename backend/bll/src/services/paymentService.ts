import Stripe from "stripe";
import { injectable, inject } from "tsyringe";
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork";
import { IPaymentService } from "../Interfaces/IPaymentService";

@injectable()
export class PaymentService implements IPaymentService {
  private stripe: Stripe;

  constructor(@inject("IUnitOfWork") private unitOfWork: IUnitOfWork) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("La clé secrète Stripe (STRIPE_SECRET_KEY) n'est pas définie dans les variables d'environnement.");
    }
    this.stripe = new Stripe(apiKey, { apiVersion: "2024-12-18.acacia" });
  }
  

  /**
   * Traite un paiement sécurisé pour une commande.
   * @param commandeId - ID de la commande
   * @param amount - Montant total de la commande
   * @param currency - Devise pour le paiement (ex: "eur")
   * @returns Client Secret pour le paiement Stripe
   */
  async processPayment(commandeId: number, amount: number, currency: string): Promise<string> {
    await this.unitOfWork.start();

    try {
      // Étape 1 : Récupérer la commande depuis la base de données
      const commande = await this.unitOfWork.commandRepository.getCommandById(commandeId);
      if (!commande) {
        throw new Error("Commande non trouvée.");
      }

      if (!amount || amount <= 0) {
        throw new Error("Le montant du paiement est invalide.");
      }
      

      // Étape 2 : Créer une intention de paiement Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Stripe utilise les centimes
        currency,
        metadata: { commandeId: commandeId.toString() },
      });

      // Étape 3 : Mettre à jour le statut de paiement à "en attente"
      await this.unitOfWork.commandRepository.updateStatutPaiement(commandeId,"en attente");

      // Valider la transaction
      await this.unitOfWork.commit();

      // Retourner le client_secret pour finaliser le paiement côté client
      return paymentIntent.client_secret!;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw new Error(`Erreur lors de la création du paiement : ${(error as Error).message}`);
    }
  }

  /**
   * Valide un paiement après confirmation côté Stripe.
   * @param commandeId - ID de la commande
   */
  async validatePayment(commandeId: number): Promise<void> {
    await this.unitOfWork.start();

    try {
      // Étape 1 : Récupérer la commande depuis la base de données
      const commande = await this.unitOfWork.commandRepository.getCommandById(commandeId);
      if (!commande) {
        throw new Error("Commande non trouvée.");
      }

      // Étape 2 : Mettre à jour le statut de paiement en "payé"
      commande.statutPaiement = "payé";
      await this.unitOfWork.commandRepository.updateStatutPaiement(commandeId,"payé");

      // Étape 3 : Valider la transaction
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw new Error(`Erreur lors de la validation du paiement : ${(error as Error).message}`);
    }
  }
}
