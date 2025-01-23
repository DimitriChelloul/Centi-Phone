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
import { Utilisateur } from '../../../../domain/src/entities/Utilisateurs';
import { LogAdmin } from '../../../../domain/src/entities/LogAdmin';
import { Session } from '../../../../domain/src/entities/session';
import { HistoriqueConsentement } from '../../../../domain/src/entities/historique_consentement';
import { inject, injectable } from "tsyringe";
import { Pool } from 'pg';
let UtilisateurRepository = class UtilisateurRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async initialize(client) {
        if (client) {
            this.client = client; // Si un PoolClient est fourni (via UnitOfWork), on l'utilise
        }
        else {
            // Sinon, on obtient un client du pool global
            try {
                this.client = await this.pool.connect();
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new Error(`Error connecting to the database: ${err.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while connecting to the database.");
                }
            }
        }
    }
    // Gestion des utilisateurs
    async getAllUtilisateurs() {
        try {
            const result = await this.client.query('SELECT * FROM utilisateurs');
            return result.rows.map((row) => new Utilisateur(row));
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la récupération des utilisateurs: ${JSON.stringify(error)}`);
            }
        }
    }
    async getUtilisateurById(id) {
        try {
            const result = await this.client.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
            return result.rows.length > 0 ? new Utilisateur(result.rows[0]) : null;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération de l'utilisateur avec l'ID ${id}: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la récupération de l'utilisateur avec l'ID ${id}: ${JSON.stringify(error)}`);
            }
        }
    }
    async createUtilisateur(utilisateur) {
        try {
            const result = await this.client.query(`INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, adresse, code_postal, ville, role, consentement_rgpd)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
                utilisateur.nom,
                utilisateur.prenom,
                utilisateur.email,
                utilisateur.motDePasse,
                utilisateur.telephone,
                utilisateur.adresse,
                utilisateur.codePostal,
                utilisateur.ville,
                utilisateur.role,
                utilisateur.consentementRgpd,
            ]);
            return new Utilisateur(result.rows[0]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la création de l'utilisateur: ${JSON.stringify(error)}`);
            }
        }
    }
    async updateUtilisateur(utilisateur) {
        try {
            const result = await this.client.query(`UPDATE utilisateurs SET nom = $1, prenom = $2, email = $3, mot_de_passe = $4, telephone = $5, adresse = $6, code_postal = $7, ville = $8, role = $9 WHERE id = $10 RETURNING *`, [
                utilisateur.nom,
                utilisateur.prenom,
                utilisateur.email,
                utilisateur.motDePasse,
                utilisateur.telephone,
                utilisateur.adresse,
                utilisateur.codePostal,
                utilisateur.ville,
                utilisateur.role,
                utilisateur.id,
            ]);
            return new Utilisateur(result.rows[0]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la mise à jour de l'utilisateur avec l'ID ${utilisateur.id}: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la mise à jour de l'utilisateur avec l'ID ${utilisateur.id}: ${JSON.stringify(error)}`);
            }
        }
    }
    async deleteUtilisateur(id) {
        try {
            await this.client.query('DELETE FROM utilisateurs WHERE id = $1', [id]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${id}: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la suppression de l'utilisateur avec l'ID ${id}: ${JSON.stringify(error)}`);
            }
        }
    }
    // Gestion des sessions utilisateur
    async getUtilisateurSessions(userId) {
        try {
            const result = await this.client.query('SELECT * FROM sessions WHERE utilisateur_id = $1', [userId]);
            return result.rows.map((row) => new Session(row));
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération des sessions pour l'utilisateur ${userId}: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la récupération des sessions pour l'utilisateur ${userId}: ${JSON.stringify(error)}`);
            }
        }
    }
    async createSession(session) {
        try {
            const result = await this.client.query(`INSERT INTO sessions (utilisateur_id, token_hash, date_creation, date_expiration, statut)
         VALUES ($1, $2, NOW(), $3, $4) RETURNING *`, [session.utilisateurId, session.tokenHash, session.dateExpiration, session.statut]);
            return new Session(result.rows[0]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création de la session: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la création de la session: ${JSON.stringify(error)}`);
            }
        }
    }
    async deleteSession(sessionId) {
        try {
            await this.client.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la suppression de la session avec l'ID ${sessionId}: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la suppression de la session avec l'ID ${sessionId}: ${JSON.stringify(error)}`);
            }
        }
    }
    // Gestion des consentements
    async getConsentHistoryByUserId(userId) {
        try {
            const result = await this.client.query('SELECT * FROM historique_consentement WHERE utilisateur_id = $1', [userId]);
            return result.rows.map((row) => new HistoriqueConsentement(row));
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération des consentements pour l'utilisateur ${userId}: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la récupération des consentements pour l'utilisateur ${userId}: ${JSON.stringify(error)}`);
            }
        }
    }
    async addConsentHistory(history) {
        try {
            await this.client.query(`INSERT INTO historique_consentement (utilisateur_id, type_consentement, statut, date_modification, source, adresse_ip)
         VALUES ($1, $2, $3, NOW(), $4, $5)`, [history.utilisateurId, history.typeConsentement, history.statut, history.source, history.adresseIp]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de l'ajout d'un historique de consentement: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de l'ajout d'un historique de consentement: ${JSON.stringify(error)}`);
            }
        }
    }
    // Gestion des logs administratifs
    async logAdminAction(log) {
        try {
            await this.client.query(`INSERT INTO logs_admin (admin_id, action, date_action) VALUES ($1, $2, NOW())`, [log.adminId, log.action]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la journalisation d'une action admin: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la journalisation d'une action admin: ${JSON.stringify(error)}`);
            }
        }
    }
    async getAdminLogs(adminId) {
        try {
            const result = await this.client.query('SELECT * FROM logs_admin WHERE admin_id = $1', [adminId]);
            return result.rows.map((row) => new LogAdmin(row));
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération des logs admin pour l'ID ${adminId}: ${error.message}`);
            }
            else {
                throw new Error(`Erreur inconnue lors de la récupération des logs admin pour l'ID ${adminId}: ${JSON.stringify(error)}`);
            }
        }
    }
};
UtilisateurRepository = __decorate([
    injectable(),
    __param(0, inject("DatabasePool")),
    __metadata("design:paramtypes", [Pool])
], UtilisateurRepository);
export { UtilisateurRepository };
