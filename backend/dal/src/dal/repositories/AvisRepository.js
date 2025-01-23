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
import { Avis } from '../../../../domain/src/entities/avis';
import { inject, injectable } from "tsyringe";
import { Pool } from "pg";
let ReviewRepository = class ReviewRepository {
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
    // Création d'un avis
    async createReview(avis) {
        const result = await this.client.query(`INSERT INTO avis (utilisateur_id, produit_a_vendre_id, appareil_reconditionne_id, commentaire, note, date_creation)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`, [
            avis.utilisateurId,
            avis.produitAVendreId || null, // Utilisation des champs distincts
            avis.appareilReconditionneId || null,
            avis.commentaire,
            avis.note,
        ]);
        return new Avis(result.rows[0]);
    }
    // Récupération des avis pour un produit spécifique
    async getReviewsByProductId(productId, type) {
        const column = type === "produit" ? "produit_a_vendre_id" : "appareil_reconditionne_id";
        const result = await this.client.query(`SELECT * FROM avis WHERE ${column} = $1`, [productId]);
        return result.rows.map((row) => new Avis(row));
    }
    // Récupération d'un avis spécifique
    async getReviewById(id) {
        const result = await this.client.query('SELECT * FROM avis WHERE id = $1', [id]);
        return result.rows.length > 0 ? new Avis(result.rows[0]) : null;
    }
    // Suppression d'un avis
    async deleteReview(id) {
        await this.client.query('DELETE FROM avis WHERE id = $1', [id]);
    }
};
ReviewRepository = __decorate([
    injectable(),
    __param(0, inject("DatabasePool")),
    __metadata("design:paramtypes", [Pool])
], ReviewRepository);
export { ReviewRepository };
