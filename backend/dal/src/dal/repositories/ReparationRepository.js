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
import { inject, injectable } from "tsyringe";
import { Pool } from "pg";
import { Rdv } from "../../../../domain/src/entities/rdv";
import { SuiviReparation } from "../../../../domain/src/entities/suivi_reparation";
import { Devis } from "../../../../domain/src/entities/devis";
// Enum pour les statuts
export var RdvStatus;
(function (RdvStatus) {
    RdvStatus["EnAttente"] = "en attente";
    RdvStatus["EnCours"] = "en cours";
    RdvStatus["Termine"] = "termine";
})(RdvStatus || (RdvStatus = {}));
export var DevisStatus;
(function (DevisStatus) {
    DevisStatus["EnAttente"] = "en attente";
    DevisStatus["Accepte"] = "accepte";
    DevisStatus["Refuse"] = "refuse";
})(DevisStatus || (DevisStatus = {}));
let RepairRepository = class RepairRepository {
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
    // Gestion des rendez-vous
    async createRdv(appointment) {
        try {
            const result = await this.client.query(`INSERT INTO rendez_vous (utilisateur_id, appareil_id, probleme_description, date_rendez_vous, statut)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
                appointment.utilisateurId,
                appointment.appareilId || null,
                appointment.problemeDescription || null,
                appointment.dateRendezVous,
                appointment.statut || RdvStatus.EnAttente,
            ]);
            return new Rdv(result.rows[0]);
        }
        catch (error) {
            console.error("Erreur lors de la création du rendez-vous:", error);
            throw new Error("Erreur lors de la création du rendez-vous.");
        }
    }
    async getRdvByUserId(userId) {
        try {
            const result = await this.client.query("SELECT * FROM rendez_vous WHERE utilisateur_id = $1", [userId]);
            return result.rows.map((row) => new Rdv(row));
        }
        catch (error) {
            console.error(`Erreur lors de la récupération des rendez-vous pour l'utilisateur ${userId}:`, error);
            throw new Error("Erreur lors de la récupération des rendez-vous.");
        }
    }
    async getRdvById(id) {
        try {
            const result = await this.client.query("SELECT * FROM rendez_vous WHERE id = $1", [id]);
            return result.rows.length > 0 ? new Rdv(result.rows[0]) : null;
        }
        catch (error) {
            console.error(`Erreur lors de la récupération du rendez-vous ${id}:`, error);
            throw new Error("Erreur lors de la récupération du rendez-vous.");
        }
    }
    async deleteRdv(id) {
        try {
            const result = await this.client.query("DELETE FROM rendez_vous WHERE id = $1", [id]);
            if (result.rowCount === 0) {
                throw new Error(`Aucun rendez-vous trouvé avec l'ID ${id}`);
            }
        }
        catch (error) {
            console.error(`Erreur lors de la suppression du rendez-vous ${id}:`, error);
            throw new Error("Erreur lors de la suppression du rendez-vous.");
        }
    }
    // Gestion des suivis de réparation
    async getRSuiviReparationByAppointmentId(appointmentId) {
        try {
            const result = await this.client.query("SELECT * FROM suivis_reparation WHERE rendez_vous_id = $1", [appointmentId]);
            return result.rows.map((row) => new SuiviReparation(row));
        }
        catch (error) {
            console.error(`Erreur lors de la récupération des suivis de réparation pour le rendez-vous ${appointmentId}:`, error);
            throw new Error("Erreur lors de la récupération des suivis de réparation.");
        }
    }
    async addSuiviReparation(tracking) {
        try {
            await this.client.query(`INSERT INTO suivis_reparation (rendez_vous_id, statut, date_statut)
         VALUES ($1, $2, NOW()) RETURNING *`, [tracking.rendezVousId, tracking.statut]);
        }
        catch (error) {
            console.error(`Erreur lors de l'ajout d'un suivi de réparation pour le rendez-vous ${tracking.rendezVousId}:`, error);
            throw new Error("Erreur lors de l'ajout d'un suivi de réparation.");
        }
    }
    // Gestion des devis
    async createDevis(devis) {
        try {
            const result = await this.client.query(`INSERT INTO devis (utilisateur_id, id_modele, id_reparation_disponible, description_probleme, estimation_prix, statut, date_creation)
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`, [
                devis.utilisateurId,
                devis.idModele || null,
                devis.idReparationDisponible || null,
                devis.descriptionProbleme || null,
                devis.estimationPrix || null,
                devis.statut || DevisStatus.EnAttente,
            ]);
            return new Devis(result.rows[0]);
        }
        catch (error) {
            console.error("Erreur lors de la création du devis:", error);
            throw new Error("Erreur lors de la création du devis.");
        }
    }
    async getDevisByUserId(userId) {
        try {
            const result = await this.client.query("SELECT * FROM devis WHERE utilisateur_id = $1", [
                userId,
            ]);
            return result.rows.map((row) => new Devis(row));
        }
        catch (error) {
            console.error(`Erreur lors de la récupération des devis pour l'utilisateur ${userId}:`, error);
            throw new Error("Erreur lors de la récupération des devis.");
        }
    }
    async getDevisById(id) {
        try {
            const result = await this.client.query("SELECT * FROM devis WHERE id = $1", [id]);
            return result.rows.length > 0 ? new Devis(result.rows[0]) : null;
        }
        catch (error) {
            console.error(`Erreur lors de la récupération du devis ${id}:`, error);
            throw new Error("Erreur lors de la récupération du devis.");
        }
    }
    async updateDevis(devis) {
        try {
            const result = await this.client.query(`UPDATE devis
         SET id_modele = $1, id_reparation_disponible = $2, description_probleme = $3, estimation_prix = $4, statut = $5
         WHERE id = $6 RETURNING *`, [
                devis.idModele || null,
                devis.idReparationDisponible || null,
                devis.descriptionProbleme || null,
                devis.estimationPrix || null,
                devis.statut || DevisStatus.EnAttente,
                devis.id,
            ]);
            return new Devis(result.rows[0]);
        }
        catch (error) {
            console.error(`Erreur lors de la mise à jour du devis ${devis.id}:`, error);
            throw new Error("Erreur lors de la mise à jour du devis.");
        }
    }
};
RepairRepository = __decorate([
    injectable(),
    __param(0, inject("DatabasePool")),
    __metadata("design:paramtypes", [Pool])
], RepairRepository);
export { RepairRepository };
