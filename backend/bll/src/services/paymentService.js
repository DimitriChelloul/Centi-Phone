var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import Stripe from "stripe";
import { injectable, inject } from "tsyringe";
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork";
let PaymentService = class PaymentService {
    constructor(unitOfWork) {
        this.unitOfWork = unitOfWork;
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-11-20.acacia" });
    }
    /**
     * Traite un paiement sécurisé pour une commande.
     * @param commandeId - ID de la commande
     * @param amount - Montant total de la commande
     * @param currency - Devise pour le paiement (ex: "eur")
     * @returns Client Secret pour le paiement Stripe
     */
    async processPayment(commandeId, amount, currency) {
        await this.unitOfWork.start();
        try {
            // Étape 1 : Récupérer la commande depuis la base de données
            const commande = await this.unitOfWork.commandRepository.getCommandById(commandeId);
            if (!commande) {
                throw new Error("Commande non trouvée.");
            }
            // Étape 2 : Créer une intention de paiement Stripe
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100, // Stripe utilise les centimes
                currency,
                metadata: { commandeId: commandeId.toString() },
            });
            // Étape 3 : Mettre à jour le statut de paiement à "en attente"
            await this.unitOfWork.commandRepository.updateStatutPaiement(commandeId, "en attente");
            // Valider la transaction
            await this.unitOfWork.commit();
            // Retourner le client_secret pour finaliser le paiement côté client
            return paymentIntent.client_secret;
        }
        catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Erreur lors de la création du paiement : ${error.message}`);
        }
    }
    /**
     * Valide un paiement après confirmation côté Stripe.
     * @param commandeId - ID de la commande
     */
    async validatePayment(commandeId) {
        await this.unitOfWork.start();
        try {
            // Étape 1 : Récupérer la commande depuis la base de données
            const commande = await this.unitOfWork.commandRepository.getCommandById(commandeId);
            if (!commande) {
                throw new Error("Commande non trouvée.");
            }
            // Étape 2 : Mettre à jour le statut de paiement en "payé"
            commande.statutPaiement = "payé";
            await this.unitOfWork.commandRepository.updateStatutPaiement(commandeId, "payé");
            // Étape 3 : Valider la transaction
            await this.unitOfWork.commit();
        }
        catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Erreur lors de la validation du paiement : ${error.message}`);
        }
    }
};
PaymentService = __decorate([
    injectable(),
    __param(0, inject("IUnitOfWork")),
    __metadata("design:paramtypes", [typeof (_a = typeof IUnitOfWork !== "undefined" && IUnitOfWork) === "function" ? _a : Object])
], PaymentService);
export { PaymentService };
