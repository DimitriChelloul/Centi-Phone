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
import { IRepairRepository } from "../../../dal/src/dal/Interfaces/IReparationRepository";
import { SuiviReparation } from '../../../domain/src/entities/suivi_reparation';
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork";
import { IEmailService } from "../Interfaces/IEmailService";
let RepairService = class RepairService {
    constructor(repairRepo, unitOfWork, emailService) {
        this.repairRepo = repairRepo;
        this.unitOfWork = unitOfWork;
        this.emailService = emailService;
    }
    async createRdv(utilisateurId, email, dateRdv) {
        await this.unitOfWork.start();
        try {
            const rdv = await this.unitOfWork.repairRepository.createRdv({
                utilisateurId,
                dateRendezVous: dateRdv,
                statut: "en attente",
            });
            await this.unitOfWork.commit();
            // Envoyer un e-mail de confirmation
            const emailHtml = `
          <h1>Confirmation de votre rendez-vous</h1>
          <p>Votre rendez-vous est prévu pour le ${dateRdv.toLocaleString()}.</p>
        `;
            await this.emailService.sendEmail(email, "Confirmation de rendez-vous", emailHtml);
        }
        catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }
    async getRdvsByUserId(utilisateurId) {
        return this.repairRepo.getRdvByUserId(utilisateurId);
    }
    async getRdvById(rdvId) {
        return this.repairRepo.getRdvById(rdvId);
    }
    async cancelRdv(rdvId) {
        await this.repairRepo.deleteRdv(rdvId);
    }
    async addSuiviReparation(rdvId, statut) {
        const suivi = new SuiviReparation({ rendezVousId: rdvId, statut, dateStatut: new Date() });
        await this.repairRepo.addSuiviReparation(suivi);
    }
    async getSuiviReparationByRdvId(rdvId) {
        return this.repairRepo.getRSuiviReparationByAppointmentId(rdvId);
    }
    async createDevis(utilisateurId, devis) {
        devis.utilisateurId = utilisateurId;
        devis.dateCreation = new Date();
        devis.statut = "en attente";
        return this.repairRepo.createDevis(devis);
    }
    async getDevisByUserId(utilisateurId) {
        return this.repairRepo.getDevisByUserId(utilisateurId);
    }
    async getDevisById(devisId) {
        return this.repairRepo.getDevisById(devisId);
    }
    async updateDevisStatus(devisId, statut) {
        const devis = await this.repairRepo.getDevisById(devisId);
        if (!devis)
            throw new Error("Devis not found");
        devis.statut = statut;
        return this.repairRepo.updateDevis(devis);
    }
    /**
   * Met à jour le statut d'une réparation et envoie un e-mail détaillé de confirmation.
   * @param rendezVousId - ID du rendez-vous.
   * @param statut - Nouveau statut de la réparation ('en cours', 'terminé').
   * @param clientEmail - Adresse e-mail du client.
   * @param clientName - Nom du client.
   */
    async updateStatutReparation(rendezVousId, statut, clientEmail, clientName) {
        await this.unitOfWork.start();
        try {
            // Étape 1 : Ajouter une entrée dans le suivi de réparation
            const suivi = {
                rendezVousId,
                statut: statut,
                dateStatut: new Date(),
            };
            await this.unitOfWork.repairRepository.addSuiviReparation(suivi);
            await this.unitOfWork.commit();
            // Étape 2 : Envoyer un e-mail de confirmation avec des détails
            const emailHtml = `
          <h1>🔧 Mise à jour de votre réparation</h1>
          <p>Bonjour <strong>${clientName}</strong>,</p>
          <p>Nous souhaitons vous informer que le statut de votre réparation a été mis à jour :</p>
          
          <table border="1" cellspacing="0" cellpadding="10">
            <tr>
              <td><strong>ID du rendez-vous :</strong></td>
              <td>${rendezVousId}</td>
            </tr>
            <tr>
              <td><strong>Statut actuel :</strong></td>
              <td>${statut === "en cours" ? "🔄 En cours" : "✅ Terminé"}</td>
            </tr>
            <tr>
              <td><strong>Date de mise à jour :</strong></td>
              <td>${new Date().toLocaleString()}</td>
            </tr>
          </table>
  
          <p>Nous vous tiendrons informé de toute évolution supplémentaire.</p>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
  
          <br />
          <p>Merci de votre confiance,</p>
          <p><strong>L'équipe de réparation</strong></p>
        `;
            await this.emailService.sendEmail(clientEmail, "🔧 Mise à jour de votre réparation", emailHtml);
        }
        catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Erreur lors de la mise à jour du statut : ${error.message}`);
        }
    }
};
RepairService = __decorate([
    injectable(),
    __param(0, inject("IRepairRepository")),
    __param(1, inject("IUnitOfWork")),
    __param(2, inject("IEmailService")),
    __metadata("design:paramtypes", [typeof (_a = typeof IRepairRepository !== "undefined" && IRepairRepository) === "function" ? _a : Object, typeof (_b = typeof IUnitOfWork !== "undefined" && IUnitOfWork) === "function" ? _b : Object, typeof (_c = typeof IEmailService !== "undefined" && IEmailService) === "function" ? _c : Object])
], RepairService);
export { RepairService };
