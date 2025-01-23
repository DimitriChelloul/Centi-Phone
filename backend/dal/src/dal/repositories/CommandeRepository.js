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
import { Commande } from 'domain/src/entities/commandes';
import { CommandDetail } from 'domain/src/entities/details_commandes';
import { Livraison } from 'domain/src/entities/livraisons';
import { OptionsDeLivraison } from 'domain/src/entities/options_livraison';
import { inject, injectable } from "tsyringe";
import { Pool } from "pg";
let CommandRepository = class CommandRepository {
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
    // Gestion des commandes
    async createCommand(command) {
        try {
            const result = await this.client.query(`INSERT INTO commandes (utilisateur_id, total, date_commande) 
         VALUES ($1, $2, NOW()) RETURNING *`, [command.utilisateurId, command.total]);
            return new Commande(result.rows[0]);
        }
        catch (error) {
            console.error('Error creating command:', error);
            throw new Error('Failed to create command.');
        }
    }
    async getCommandById(id) {
        try {
            const result = await this.client.query('SELECT * FROM commandes WHERE id = $1', [id]);
            return result.rows.length > 0 ? new Commande(result.rows[0]) : null;
        }
        catch (error) {
            console.error('Error fetching command by ID:', error);
            throw new Error('Failed to retrieve command.');
        }
    }
    async getCommandsByUserId(userId) {
        try {
            const result = await this.client.query('SELECT * FROM commandes WHERE utilisateur_id = $1', [userId]);
            return result.rows.map((row) => new Commande(row));
        }
        catch (error) {
            console.error('Error fetching commands by user ID:', error);
            throw new Error('Failed to retrieve user commands.');
        }
    }
    async deleteCommand(id) {
        try {
            await this.client.query('DELETE FROM commandes WHERE id = $1', [id]);
        }
        catch (error) {
            console.error('Error deleting command:', error);
            throw new Error('Failed to delete command.');
        }
    }
    // Gestion des détails de commande
    async getCommandDetails(commandId) {
        try {
            const result = await this.client.query('SELECT * FROM details_commande WHERE commande_id = $1', [commandId]);
            return result.rows.map((row) => new CommandDetail(row));
        }
        catch (error) {
            console.error('Error fetching command details:', error);
            throw new Error('Failed to retrieve command details.');
        }
    }
    async addCommandDetail(detail) {
        try {
            const result = await this.client.query(`INSERT INTO details_commande (commande_id, produit_a_vendre_id, appareil_reconditionne_id, quantite, prix_unitaire) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
                detail.commandeId,
                detail.produitAVendreId,
                detail.appareilReconditionneId,
                detail.quantite,
                detail.prixUnitaire,
            ]);
            return new CommandDetail(result.rows[0]);
        }
        catch (error) {
            console.error('Error adding command detail:', error);
            throw new Error('Failed to add command detail.');
        }
    }
    // Gestion des livraisons
    async createLivraison(delivery) {
        try {
            const result = await this.client.query(`INSERT INTO livraisons (commande_id, option_livraison_id, adresse_livraison, date_livraison_prevue, statut) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
                delivery.commandeId,
                delivery.optionLivraisonId,
                delivery.adresseLivraison,
                delivery.dateLivraisonPrevue,
                delivery.statut,
            ]);
            return new Livraison(result.rows[0]);
        }
        catch (error) {
            console.error('Error creating delivery:', error);
            throw new Error('Failed to create delivery.');
        }
    }
    async getLivraisonByCommandId(commandId) {
        try {
            const result = await this.client.query('SELECT * FROM livraisons WHERE commande_id = $1', [commandId]);
            return result.rows.length > 0 ? new Livraison(result.rows[0]) : null;
        }
        catch (error) {
            console.error('Error fetching delivery by command ID:', error);
            throw new Error('Failed to retrieve delivery.');
        }
    }
    async getAllDeliveryOptions() {
        try {
            const result = await this.client.query('SELECT * FROM options_livraison');
            return result.rows.map((row) => new OptionsDeLivraison(row));
        }
        catch (error) {
            console.error('Error fetching all delivery options:', error);
            throw new Error('Failed to retrieve delivery options.');
        }
    }
    async updateStatutPaiement(commandeId, statut) {
        const query = `
      UPDATE commandes
      SET statut_paiement = $1
      WHERE id = $2;
    `;
        await this.client.query(query, [statut, commandeId]);
    }
};
CommandRepository = __decorate([
    injectable(),
    __param(0, inject("DatabasePool")),
    __metadata("design:paramtypes", [Pool])
], CommandRepository);
export { CommandRepository };
