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
var _a, _b, _c;
import { injectable, inject } from "tsyringe";
import { ICommandRepository } from "../../../dal/src/dal/Interfaces/ICommandeRepository";
import { Livraison } from '../../../domain/src/entities/livraisons';
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork";
import { IEmailService } from "../Interfaces/IEmailService";
import { AppErrorGen } from "../../../domain/src/utils/AppErrorGen";
// Suppression de l'import de `errorHandler`.
let CommandeService = class CommandeService {
    constructor(commandRepo, unitOfWork, emailService) {
        this.commandRepo = commandRepo;
        this.unitOfWork = unitOfWork;
        this.emailService = emailService;
    }
    /**
      * Crée une commande avec ses détails, met à jour le stock, et envoie un e-mail de confirmation.
      * @param utilisateurId - ID de l'utilisateur qui passe la commande.
      * @param details - Détails de la commande (produits, quantités, prix).
      * @param email - Adresse e-mail pour envoyer la confirmation.
      */
    async createCommande(utilisateurId, details, email) {
        await this.unitOfWork.start();
        try {
            // Étape 1 : Calculer le total de la commande
            const total = details.reduce((sum, detail) => sum + detail.prixUnitaire * detail.quantite, 0);
            // Étape 2 : Créer la commande dans la base de données
            const commande = await this.unitOfWork.commandRepository.createCommand({
                utilisateurId,
                dateCommande: new Date(),
                total,
                statutPaiement: "en attente"
            });
            const commandeId = commande.id;
            // Étape 3 : Ajouter les détails de la commande et mettre à jour les stocks
            for (const detail of details) {
                detail.commandeId = commande.id; // Associer les détails à la commande
                await this.unitOfWork.commandRepository.addCommandDetail(detail);
                // Mettre à jour le stock pour chaque produit commandé
                if (detail.produitAVendreId) {
                    await this.unitOfWork.productRepository.updateStock(detail.produitAVendreId, -detail.quantite);
                }
                else if (detail.appareilReconditionneId) {
                    await this.unitOfWork.productRepository.updateStock(detail.appareilReconditionneId, -detail.quantite);
                }
            }
            // Étape 4 : Valider la transaction
            await this.unitOfWork.commit();
            // Étape 5 : Envoyer un e-mail de confirmation
            const emailHtml = `
      <h1>Confirmation de votre commande</h1>
      <p>Merci pour votre commande n°<strong>${commande.id}</strong>.</p>
      <p>Montant total : <strong>${total.toFixed(2)} €</strong></p>
      <p>Votre commande est en cours de traitement et nous vous tiendrons informé de sa progression.</p>
      <br />
      <p>Merci pour votre confiance,</p>
      <p>L'équipe de réparation.</p>
    `;
            await this.emailService.sendEmail(email, "Confirmation de votre commande", emailHtml);
            return commande; // Retourner la commande créée
        }
        catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Erreur lors de la création de la commande : ${error.message}`);
        }
    }
    async getCommandeById(commandeId) {
        const commande = this.commandRepo.getCommandById(commandeId);
        if (!commande) {
            throw new AppErrorGen("Commande non trouvée", 404); // Lever une erreur personnalisée
        }
        return commande;
    }
    async getCommandesByUserId(utilisateurId) {
        return this.commandRepo.getCommandsByUserId(utilisateurId);
    }
    async cancelCommande(commandeId) {
        await this.commandRepo.deleteCommand(commandeId);
    }
    async getCommandeDetails(commandeId) {
        return this.commandRepo.getCommandDetails(commandeId);
    }
    async addCommandeDetail(commandeId, detail) {
        detail.commandeId = commandeId;
        return this.commandRepo.addCommandDetail(detail);
    }
    async createLivraison(commandeId, optionId, adresseLivraison) {
        const livraison = new Livraison({
            commandeId,
            optionLivraisonId: optionId,
            adresseLivraison,
            statut: "en attente",
        });
        return this.commandRepo.createLivraison(livraison);
    }
    async getLivraisonByCommandeId(commandeId) {
        return this.commandRepo.getLivraisonByCommandId(commandeId);
    }
    async getAllDeliveryOptions() {
        return this.commandRepo.getAllDeliveryOptions();
    }
};
CommandeService = __decorate([
    injectable(),
    __param(0, inject("ICommandRepository")),
    __param(1, inject("IUnitOfWork")),
    __param(2, inject("IEmailService")),
    __metadata("design:paramtypes", [typeof (_a = typeof ICommandRepository !== "undefined" && ICommandRepository) === "function" ? _a : Object, typeof (_b = typeof IUnitOfWork !== "undefined" && IUnitOfWork) === "function" ? _b : Object, typeof (_c = typeof IEmailService !== "undefined" && IEmailService) === "function" ? _c : Object])
], CommandeService);
export { CommandeService };
