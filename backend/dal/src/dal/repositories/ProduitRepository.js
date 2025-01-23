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
import { ProduitsAVendre } from '../../../../domain/src/entities/Produits_a_vendre';
import { ProduitsReconditionnes } from '../../../../domain/src/entities/appareils_reconditionnes';
import { Marques } from '../../../../domain/src/entities/Marques';
import { Modele } from '../../../../domain/src/entities/Modeles';
import { inject, injectable } from "tsyringe";
import { Pool } from "pg";
let ProductRepository = class ProductRepository {
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
    // Gestion des produits à vendre
    async getAllProductsToSell() {
        try {
            const result = await this.client.query('SELECT * FROM produits_a_vendre');
            return result.rows.map((row) => new ProduitsAVendre(row));
        }
        catch (error) {
            console.error('Error fetching products to sell:', error);
            throw new Error('Failed to fetch products to sell');
        }
    }
    async getProductToSellById(id) {
        try {
            const result = await this.client.query('SELECT * FROM produits_a_vendre WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                return new ProduitsAVendre(result.rows[0]);
            }
            return null;
        }
        catch (error) {
            console.error(`Error fetching product to sell with id ${id}:`, error);
            throw new Error('Failed to fetch product to sell');
        }
    }
    async createProduit(produit) {
        try {
            const result = await this.client.query(`INSERT INTO produits_a_vendre (nom, description, photo_produit, prix, stock, date_ajout)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`, [produit.nom, produit.description, produit.photoProduit, produit.prix, produit.stock]);
            return new ProduitsAVendre(result.rows[0]);
        }
        catch (error) {
            console.error('Error creating product to sell:', error);
            throw new Error('Failed to create product to sell');
        }
    }
    async updateProduit(produit) {
        try {
            const result = await this.client.query(`UPDATE produits_a_vendre
         SET nom = $1, description = $2, photo_produit = $3, prix = $4, stock = $5
         WHERE id = $6 RETURNING *`, [produit.nom, produit.description, produit.photoProduit, produit.prix, produit.stock, produit.id]);
            return new ProduitsAVendre(result.rows[0]);
        }
        catch (error) {
            console.error(`Error updating product to sell with id ${produit.id}:`, error);
            throw new Error('Failed to update product to sell');
        }
    }
    async deleteProduct(id) {
        try {
            await this.client.query('DELETE FROM produits_a_vendre WHERE id = $1', [id]);
        }
        catch (error) {
            console.error(`Error deleting product to sell with id ${id}:`, error);
            throw new Error('Failed to delete product to sell');
        }
    }
    // Gestion des appareils reconditionnés
    async getAllRefurbishedDevices() {
        try {
            const result = await this.client.query(`SELECT ar.*, m.nom_marque, md.nom_modele
         FROM appareils_reconditionnes ar
         JOIN marques m ON ar.id_marque = m.id
         JOIN modeles md ON ar.id_modele = md.id`);
            return result.rows.map((row) => new ProduitsReconditionnes({
                ...row,
                nomMarque: row.nom_marque,
                nomModele: row.nom_modele,
            }));
        }
        catch (error) {
            console.error('Error fetching refurbished devices:', error);
            throw new Error('Failed to fetch refurbished devices');
        }
    }
    async getRefurbishedDeviceById(id) {
        try {
            const result = await this.client.query(`SELECT ar.*, m.nom_marque, md.nom_modele
         FROM appareils_reconditionnes ar
         JOIN marques m ON ar.id_marque = m.id
         JOIN modeles md ON ar.id_modele = md.id
         WHERE ar.id = $1`, [id]);
            // Utilisation de rows.length pour vérifier les résultats
            if (result.rows.length > 0) {
                return new ProduitsReconditionnes({
                    ...result.rows[0],
                    nomMarque: result.rows[0].nom_marque,
                    nomModele: result.rows[0].nom_modele,
                });
            }
            // Retour explicite si aucun résultat n'est trouvé
            return null;
        }
        catch (error) {
            console.error(`Error fetching refurbished device with id ${id}:`, error);
            throw new Error('Failed to fetch refurbished device');
        }
    }
    async createRefurbishedDevice(device) {
        try {
            const result = await this.client.query(`INSERT INTO appareils_reconditionnes (id_marque, id_modele, description, photo_produit, prix, stock, garantie_mois, date_reconditionnement, date_ajout)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`, [
                device.idMarque,
                device.idModele,
                device.description,
                device.photoProduit,
                device.prix,
                device.stock,
                device.garantieMois,
                device.dateReconditionnement,
            ]);
            return new ProduitsReconditionnes(result.rows[0]);
        }
        catch (error) {
            console.error('Error creating refurbished device:', error);
            throw new Error('Failed to create refurbished device');
        }
    }
    async updateRefurbishedDevice(device) {
        try {
            const result = await this.client.query(`UPDATE appareils_reconditionnes
         SET id_marque = $1, id_modele = $2, description = $3, photo_produit = $4, prix = $5, stock = $6, garantie_mois = $7, date_reconditionnement = $8
         WHERE id = $9 RETURNING *`, [
                device.idMarque,
                device.idModele,
                device.description,
                device.photoProduit,
                device.prix,
                device.stock,
                device.garantieMois,
                device.dateReconditionnement,
                device.id,
            ]);
            return new ProduitsReconditionnes(result.rows[0]);
        }
        catch (error) {
            console.error(`Error updating refurbished device with id ${device.id}:`, error);
            throw new Error('Failed to update refurbished device');
        }
    }
    async deleteRefurbishedDevice(id) {
        try {
            await this.client.query('DELETE FROM appareils_reconditionnes WHERE id = $1', [id]);
        }
        catch (error) {
            console.error(`Error deleting refurbished device with id ${id}:`, error);
            throw new Error('Failed to delete refurbished device');
        }
    }
    // Gestion des marques et modèles
    async getAllBrands() {
        try {
            const result = await this.client.query('SELECT * FROM marques');
            return result.rows.map((row) => new Marques(row));
        }
        catch (error) {
            console.error('Error fetching brands:', error);
            throw new Error('Failed to fetch brands');
        }
    }
    async getBrandById(id) {
        try {
            const result = await this.client.query('SELECT * FROM marques WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                return new Marques(result.rows[0]);
            }
            return null;
        }
        catch (error) {
            console.error(`Error fetching brand with id ${id}:`, error);
            throw new Error('Failed to fetch brand');
        }
    }
    async getAllModelsByBrand(brandId) {
        try {
            const result = await this.client.query('SELECT * FROM modeles WHERE id_marque = $1', [brandId]);
            return result.rows.map((row) => new Modele(row));
        }
        catch (error) {
            console.error(`Error fetching models for brand with id ${brandId}:`, error);
            throw new Error('Failed to fetch models');
        }
    }
    /**
   * Met à jour le stock d'un produit.
   * @param productId - ID du produit.
   * @param quantityChange - Quantité à ajouter ou déduire (peut être négatif).
   */
    async updateStock(productId, quantityChange) {
        const query = `
        UPDATE produits_a_vendre
        SET stock = stock + $1
        WHERE id = $2
      `;
        await this.client.query(query, [quantityChange, productId]);
    }
};
ProductRepository = __decorate([
    injectable(),
    __param(0, inject("DatabasePool")),
    __metadata("design:paramtypes", [Pool])
], ProductRepository);
export { ProductRepository };
