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
import { injectable, inject } from "tsyringe";
import { IUtilisateurRepository } from "../../../dal/src/dal/Interfaces/IUtilisateurRepository";
import { Session } from '../../../domain/src/entities/session';
import { HistoriqueConsentement } from '../../../domain/src/entities/historique_consentement';
import { LogAdmin } from '../../../domain/src/entities/LogAdmin';
let UtilisateurService = class UtilisateurService {
    constructor(utilisateurRepo) {
        this.utilisateurRepo = utilisateurRepo;
    }
    async getAllUtilisateurs() {
        return this.utilisateurRepo.getAllUtilisateurs();
    }
    async getUtilisateurById(id) {
        return this.utilisateurRepo.getUtilisateurById(id);
    }
    async createUtilisateur(utilisateur) {
        return this.utilisateurRepo.createUtilisateur(utilisateur);
    }
    async updateUtilisateur(utilisateur) {
        return this.utilisateurRepo.updateUtilisateur(utilisateur);
    }
    async deleteUtilisateur(id) {
        return this.utilisateurRepo.deleteUtilisateur(id);
    }
    async createSession(utilisateurId, token) {
        const session = new Session({
            utilisateurId,
            tokenHash: token,
            dateCreation: new Date(),
            dateExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
            statut: "actif",
        });
        return this.utilisateurRepo.createSession(session);
    }
    async revokeSession(sessionId) {
        return this.utilisateurRepo.deleteSession(sessionId);
    }
    async getUtilisateurSessions(utilisateurId) {
        return this.utilisateurRepo.getUtilisateurSessions(utilisateurId);
    }
    async getConsentHistory(utilisateurId) {
        return this.utilisateurRepo.getConsentHistoryByUserId(utilisateurId);
    }
    async addConsentHistory(utilisateurId, typeConsentement, statut, source, adresseIp) {
        const history = new HistoriqueConsentement({
            utilisateurId,
            typeConsentement,
            statut,
            dateModification: new Date(),
            source,
            adresseIp,
        });
        await this.utilisateurRepo.addConsentHistory(history);
    }
    async logAdminAction(adminId, action) {
        const log = new LogAdmin({ adminId, action, dateAction: new Date() });
        await this.utilisateurRepo.logAdminAction(log);
    }
    async getAdminLogs(adminId) {
        return this.utilisateurRepo.getAdminLogs(adminId);
    }
};
UtilisateurService = __decorate([
    injectable(),
    __param(0, inject("IUtilisateurRepository")),
    __metadata("design:paramtypes", [typeof (_a = typeof IUtilisateurRepository !== "undefined" && IUtilisateurRepository) === "function" ? _a : Object])
], UtilisateurService);
export { UtilisateurService };
