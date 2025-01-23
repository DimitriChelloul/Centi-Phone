import { ProduitsAVendre } from '../../../../domain/src/entities/Produits_a_vendre';
import { ProduitsReconditionnes } from '../../../../domain/src/entities/appareils_reconditionnes';
import { Marques } from '../../../../domain/src/entities/Marques';
import { Modele } from '../../../../domain/src/entities/Modeles';
import { PoolClient } from 'pg';

export interface IProductRepository {
  initialize(client: PoolClient): unknown;

 /**
   * Met à jour le stock d'un produit en ajoutant ou soustrayant une quantité.
   * @param productId - ID du produit.
   * @param quantityChange - Quantité à ajouter (valeur positive) ou déduire (valeur négative).
   */

  // Gestion des produits à vendre
  getAllProductsToSell(): Promise<ProduitsAVendre[]>;
  getProductToSellById(id: number): Promise<ProduitsAVendre | null>;
  createProduit(produit: ProduitsAVendre): Promise<ProduitsAVendre>;
  updateProduit(produitId: number, updatedData: Partial<ProduitsAVendre>): Promise<ProduitsAVendre>;
  updateRefurbishedDevices(deviceId: number, updatedData: Partial<ProduitsReconditionnes>): Promise<ProduitsReconditionnes>;

  deleteProduct(id: number): Promise<void>;
  updateStock(productId: number, quantityChange: number): Promise<void>;
    // Ajout de la méthode pour récupérer un produit par ID
    getProductById(id: number): Promise<ProduitsAVendre | null>;
  

  // Gestion des appareils reconditionnés
  getAllRefurbishedDevices(): Promise<ProduitsReconditionnes[]>;
  getRefurbishedDeviceById(id: number): Promise<ProduitsReconditionnes | null>;
  createRefurbishedDevice(device: ProduitsReconditionnes): Promise<ProduitsReconditionnes>;
  
  deleteRefurbishedDevice(id: number): Promise<void>;

  // Gestion des marques et modèles
  getAllBrands(): Promise<Marques[]>;
  getBrandById(id: number): Promise<Marques | null>;
  getAllModelsByBrand(brandId: number): Promise<Modele[]>;
}
