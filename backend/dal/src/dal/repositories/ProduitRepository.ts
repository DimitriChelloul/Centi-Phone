import { query, pool } from '../config/db'; // Connexion à la base de données
import { IProductRepository } from '../../dal/Interfaces/IProduitRepository';
import { ProduitsAVendre } from '../../../../domain/src/entities/Produits_a_vendre';
import { ProduitsReconditionnes } from '../../../../domain/src/entities/appareils_reconditionnes';
import { Marques } from '../../../../domain/src/entities/Marques';
import { Modele } from '../../../../domain/src/entities/Modeles';
import { inject, injectable } from "tsyringe";
import { Pool, PoolClient } from "pg";
import fs from "fs/promises"; // Pour la gestion des fichiers

// La classe ProductRepository est déclarée et exportée pour être utilisée ailleurs dans l'application.
//  Elle implémente l'interface IProductRepository.
//  Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class ProductRepository implements IProductRepository {

  // La propriété client est déclarée comme privée et de type PoolClient. Elle est utilisée pour gérer les connexions à la base de données.
  private client!: PoolClient;

  // Le constructeur prend un paramètre pool de type Pool. Le décorateur @inject("DatabasePool") est utilisé pour injecter une instance de Pool dans la propriété pool.
  constructor(@inject("DatabasePool") private pool: Pool) {}

  // Cette méthode est asynchrone et prend un paramètre optionnel client de type PoolClient. Elle retourne une promesse de type void.
  async initialize(client?: PoolClient): Promise<void> {
    // Si un PoolClient est fourni, il est assigné à la propriété client.
    if (client) {
      this.client = client; // Si un PoolClient est fourni (via UnitOfWork), on l'utilise
    } else {
      // Si aucun PoolClient n'est fourni, un nouveau client est obtenu du pool global en utilisant la méthode connect du pool
      try {
        this.client = await this.pool.connect();
      } catch (err) {
        // Les erreurs éventuelles sont capturées et une nouvelle erreur est levée avec un message descriptif.
        if (err instanceof Error) {
          throw new Error(`Error connecting to the database: ${err.message}`);
        } else {
          throw new Error("An unknown error occurred while connecting to the database.");
        }
      }
    }
  }

  // Cette méthode est asynchrone et prend un paramètre id (l'ID du produit). Elle retourne une promesse de type ProduitsAVendre ou null.
  async getProductById(id: number): Promise<ProduitsAVendre | null> {
    try {

      //La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table produits_a_vendre pour récupérer le produit par son ID.
      const result = await pool.query(
        `SELECT * FROM produits_a_vendre WHERE id = $1`,
        [id]
      );

      // Si aucun produit n'est trouvé, null est retourné.
      if (result.rows.length === 0) {
        return null; // Produit non trouvé
      }

      // Si un produit est trouvé, une nouvelle instance de ProduitsAVendre est créée avec les données retournées par la requête et est retournée.
      return new ProduitsAVendre(result.rows[0]);
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Erreur lors de la récupération du produit par ID :', error);
      throw new Error('Erreur lors de la récupération du produit.');
    }
  }

  // Gestion des produits à vendre
  //Cette méthode est asynchrone et retourne une promesse de type tableau de ProduitsAVendre
  async getAllProductsToSell(): Promise<ProduitsAVendre[]> {
    console.log('🔹 [DEBUG] Entrée dans getAllProductsToSell()...');
    try {
      console.log('🔹 [DEBUG] Exécution de la requête SQL...');
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table produits_a_vendre pour récupérer tous les produits à vendre.
      const result = await pool.query('SELECT * FROM produits_a_vendre');
      console.log('✅ [DEBUG] Résultat SQL obtenu:', result, 'lignes.');
      // Les résultats de la requête sont mappés en instances de ProduitsAVendre et retournés.
      return result.rows.map((row) => new ProduitsAVendre(row));
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif
      console.error('Error fetching products to sell:', error);
      throw new Error('Failed to fetch products to sell');
    }
  }

  //Cette méthode est asynchrone et prend un paramètre id (l'ID du produit). Elle retourne une promesse de type ProduitsAVendre ou null.
  async getProductToSellById(id: number): Promise<ProduitsAVendre | null> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table produits_a_vendre pour récupérer le produit par son ID.
      const result = await pool.query('SELECT * FROM produits_a_vendre WHERE id = $1', [id]);
      //Si un produit est trouvé, une nouvelle instance de ProduitsAVendre est créée avec les données retournées par la requête et est retournée. 
      if (result.rows.length > 0){
        return new ProduitsAVendre(result.rows[0]);
      }
      
      //Sinon, null est retourné.
        return null;

    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Error fetching product to sell with id ${id}:`, error);
      throw new Error('Failed to fetch product to sell');
    }
  }

  //Cette méthode est asynchrone et prend un paramètre produit de type ProduitsAVendre. Elle retourne une promesse de type ProduitsAVendre.
  async createProduit(produit: ProduitsAVendre): Promise<ProduitsAVendre> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion dans la table produits_a_vendre.
      //  Les valeurs des champs du produit sont passées en paramètres.
      const result = await pool.query(
        `INSERT INTO produits_a_vendre (nom, description, photo_produit, prix, stock, date_ajout)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [produit.nom, produit.description, produit.photoProduit, produit.prix, produit.stock]
      );
      // Une nouvelle instance de ProduitsAVendre est créée avec les données retournées par la requête et est retournée.
      return new ProduitsAVendre(result.rows[0]);
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error creating product to sell:', error);
      throw new Error('Failed to create product to sell');
    }
  }

  //Cette méthode est asynchrone et prend deux paramètres :
  //  produitId (l'ID du produit) et updatedData (les données mises à jour de type Partial<ProduitsAVendre>). Elle retourne une promesse de type ProduitsAVendre
  async updateProduit(produitId: number, updatedData: Partial<ProduitsAVendre>): Promise<ProduitsAVendre> {
    try {

      // La méthode getRefurbishedDeviceById est appelée pour récupérer l'appareil actuel par son ID.
      const existingProduct = await this.getProductById(produitId);
  
      // Si l'appareil n'est pas trouvé, une erreur est levée.
      if (!existingProduct) {
        throw new Error("Appareil reconditionné introuvable.");
      }
  
      // Si une nouvelle image est fournie et qu'une ancienne image existe,
      //  l'ancienne image est supprimée en utilisant la méthode unlink du module fs.
      if (updatedData.photoProduit && existingProduct.photoProduit) {
        try {
          await fs.unlink(existingProduct.photoProduit); // Supprimer l'ancien fichier image
        } catch (error) {
          //Les erreurs éventuelles sont loguées dans la console.
          console.error("Erreur lors de la suppression de l'ancien fichier :", error);
        }
      }

      // Les colonnes à mettre à jour sont générées dynamiquement en fonction des clés de updatedData.
      const columns = Object.keys(updatedData).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = Object.values(updatedData);

      //  La méthode query du client est utilisée
      //  pour exécuter une requête SQL de mise à jour dans la table produits_a_vendre.
      //  Les valeurs des champs à mettre à jour sont passées en paramètres.
      const result = await pool.query(
        `UPDATE produits_a_vendre SET ${columns} WHERE id = $1 RETURNING *`,
        [produitId, ...values]
      );

      // Si aucun produit n'est trouvé, une erreur est levée.
      if (result.rows.length === 0) {
        throw new Error("Produit introuvable.");
      }

      // Une nouvelle instance de ProduitsAVendre est créée avec les données retournées par la requête et est retournée.
      return new ProduitsAVendre(result.rows[0]);
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error("Erreur lors de la mise à jour du produit :", error);
      throw new Error("Échec de la mise à jour du produit.");
    }
  }

  //Cette méthode est asynchrone et prend deux paramètres : deviceId (l'ID de l'appareil)
  //  et updatedData (les données mises à jour de type Partial<ProduitsReconditionnes>).
  //  Elle retourne une promesse de type ProduitsReconditionnes.
  async updateRefurbishedDevices(deviceId: number, updatedData: Partial<ProduitsReconditionnes>): Promise<ProduitsReconditionnes> {
    try {
      // La méthode getRefurbishedDeviceById est appelée pour récupérer l'appareil actuel par son ID.
      const existingDevice = await this.getRefurbishedDeviceById(deviceId);
  
      // Si l'appareil n'est pas trouvé, une erreur est levée.
      if (!existingDevice) {
        throw new Error("Appareil reconditionné introuvable.");
      }
  
      // Si une nouvelle image est fournie et qu'une ancienne image existe,
      //  l'ancienne image est supprimée en utilisant la méthode unlink du module fs.
      if (updatedData.photoProduit && existingDevice.photoProduit) {
        try {
          await fs.unlink(existingDevice.photoProduit); // Supprimer l'ancien fichier image
        } catch (error) {
          //Les erreurs éventuelles sont loguées dans la console.
          console.error("Erreur lors de la suppression de l'ancien fichier :", error);
        }
      }
  
      // Les colonnes à mettre à jour sont générées dynamiquement en fonction des clés de updatedData.
      const columns = Object.keys(updatedData).map((key, index) => `${key} = $${index + 2}`).join(", ");
      const values = Object.values(updatedData);
  
      //  La méthode query du client est utilisée pour exécuter une requête SQL 
      // de mise à jour dans la table appareils_reconditionnes. Les valeurs des champs à mettre à jour sont passées en paramètres.
      const result = await pool.query(
        `UPDATE appareils_reconditionnes SET ${columns} WHERE id = $1 RETURNING *`,
        [deviceId, ...values]
      );
  
      //Si aucun appareil n'est trouvé, une erreur est levée.
      if (result.rows.length === 0) {
        throw new Error("Appareil reconditionné introuvable.");
      }
  
      // Une nouvelle instance de ProduitsReconditionnes est créée avec les données retournées par la requête et est retournée.
      return new ProduitsReconditionnes(result.rows[0]);
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error("Erreur lors de la mise à jour de l'appareil reconditionné :", error);
      throw new Error("Échec de la mise à jour de l'appareil reconditionné.");
    }
  }


  // Cette méthode est asynchrone et prend un paramètre id (l'ID du produit). Elle retourne une promesse de type void.
  async deleteProduct(id: number): Promise<void> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de suppression dans la table produits_a_vendre pour supprimer le produit par son ID.
      await pool.query('DELETE FROM produits_a_vendre WHERE id = $1', [id]);
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif
      console.error(`Error deleting product to sell with id ${id}:`, error);
      throw new Error('Failed to delete product to sell');
    }
  }

  // Gestion des appareils reconditionnés
  //Cette méthode est asynchrone et retourne une promesse de type tableau de ProduitsReconditionnes
  async getAllRefurbishedDevices(): Promise<ProduitsReconditionnes[]> {
    try {
      //La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table appareils_reconditionnes
      //  avec des jointures sur les tables marques et modeles pour récupérer tous les appareils reconditionnés avec leurs marques et modèles associés.
      const result = await pool.query(
        `SELECT ar.*, m.nom_marque, md.nom_modele
         FROM appareils_reconditionnes ar
         JOIN marques m ON ar.idmarque = m.id
         JOIN modeles md ON ar.idmodele = md.id`
      );
      // Les résultats de la requête sont mappés en instances de ProduitsReconditionnes et retournés.
      return result.rows.map(
        (row) =>
          new ProduitsReconditionnes({
            ...row,
            nomMarque: row.nom_marque,
            nomModele: row.nom_modele,
          })
      );
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error fetching refurbished devices:', error);
      throw new Error('Failed to fetch refurbished devices');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre id (l'ID de l'appareil). Elle retourne une promesse de type ProduitsReconditionnes ou null.
  async getRefurbishedDeviceById(id: number): Promise<ProduitsReconditionnes | null> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table appareils_reconditionnes
      //  avec des jointures sur les tables marques et modeles pour récupérer l'appareil reconditionné par son ID avec sa marque et son modèle associés.
      const result = await pool.query(
        `SELECT ar.*, m.nom_marque, md.nom_modele
         FROM appareils_reconditionnes ar
         JOIN marques m ON ar.idmarque = m.id
         JOIN modeles md ON ar.idmodele = md.id
         WHERE ar.id = $1`,
        [id]
      );
  
      // Si un appareil est trouvé,
      //  une nouvelle instance de ProduitsReconditionnes est créée avec les données retournées par la requête et est retournée. 
      if (result.rows.length > 0) {
        return new ProduitsReconditionnes({
          ...result.rows[0],
          nomMarque: result.rows[0].nom_marque,
          nomModele: result.rows[0].nom_modele,
        });
      }
  
      // Sinon, null est retourné
      return null;
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Error fetching refurbished device with id ${id}:`, error);
      throw new Error('Failed to fetch refurbished device');
    }
  }
  

  //Cette méthode est asynchrone et prend un paramètre device de type ProduitsReconditionnes. Elle retourne une promesse de type ProduitsReconditionnes.
  async createRefurbishedDevice(device: ProduitsReconditionnes): Promise<ProduitsReconditionnes> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL d'insertion dans la table appareils_reconditionnes.
      //  Les valeurs des champs de l'appareil sont passées en paramètres
      const result = await pool.query(
        `INSERT INTO appareils_reconditionnes (idmarque, idmodele, description, photo_produit, prix, stock, garantie_mois, date_reconditionnement, date_ajout)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
        [
          device.idMarque,
          device.idModele,
          device.description,
          device.photoProduit,
          device.prix,
          device.stock,
          device.garantieMois,
          device.dateReconditionnement,
        ]
      );
      // Une nouvelle instance de ProduitsReconditionnes est créée avec les données retournées par la requête et est retournée.
      return new ProduitsReconditionnes(result.rows[0]);
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error creating refurbished device:', error);
      throw new Error('Failed to create refurbished device');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre id (l'ID de l'appareil). Elle retourne une promesse de type void.
  async deleteRefurbishedDevice(id: number): Promise<void> {
    try {
      //La méthode query du client est utilisée pour exécuter une requête SQL de suppression dans la table appareils_reconditionnes pour supprimer l'appareil par son ID.
      await pool.query('DELETE FROM appareils_reconditionnes WHERE id = $1', [id]);
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Error deleting refurbished device with id ${id}:`, error);
      throw new Error('Failed to delete refurbished device');
    }
  }

  // Gestion des marques et modèles
  //Cette méthode est asynchrone et retourne une promesse de type tableau de Marques.
  async getAllBrands(): Promise<Marques[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table marques pour récupérer toutes les marques.
      const result = await pool.query('SELECT * FROM marques');
      // Les résultats de la requête sont mappés en instances de Marques et retournés.
      return result.rows.map((row) => new Marques(row));
    } catch (error) {
      // Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error('Error fetching brands:', error);
      throw new Error('Failed to fetch brands');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre id (l'ID de la marque). Elle retourne une promesse de type Marques ou null.
  async getBrandById(id: number): Promise<Marques | null> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection dans la table marques pour récupérer la marque par son ID.
      const result = await pool.query('SELECT * FROM marques WHERE id = $1', [id]);
      //Si une marque est trouvée, une nouvelle instance de Marques est créée avec les données retournées par la requête et est retournée
      if (result.rows.length > 0){
        return new Marques(result.rows[0]);
      }

      // Sinon, null est retourné.
      return null;
      
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Error fetching brand with id ${id}:`, error);
      throw new Error('Failed to fetch brand');
    }
  }

  // Cette méthode est asynchrone et prend un paramètre brandId (l'ID de la marque). Elle retourne une promesse de type tableau de Modele.
  async getAllModelsByBrand(brandId: number): Promise<Modele[]> {
    try {
      // La méthode query du client est utilisée pour exécuter une requête SQL de sélection 
      // dans la table modeles pour récupérer tous les modèles associés à la marque par son ID.
      const result = await pool.query('SELECT * FROM modeles WHERE id_marque = $1', [brandId]);
      // Les résultats de la requête sont mappés en instances de Modele et retournés.
      return result.rows.map((row) => new Modele(row));
    } catch (error) {
      //Si une erreur survient, elle est loguée dans la console et une nouvelle erreur est levée avec un message descriptif.
      console.error(`Error fetching models for brand with id ${brandId}:`, error);
      throw new Error('Failed to fetch models');
    }
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  productId (l'ID du produit) et quantityChange (la quantité à ajouter ou déduire, peut être négatif).
  //  Elle retourne une promesse de type void.
    async updateStock(productId: number, quantityChange: number): Promise<void> {

      const query = `
        UPDATE produits_a_vendre
        SET stock = stock + $1
        WHERE id = $2
      `;
      // La méthode query du client est utilisée pour exécuter une requête SQL 
      // de mise à jour dans la table produits_a_vendre pour mettre à jour le stock du produit par son ID.
      await pool.query(query, [quantityChange, productId]);
    }
}