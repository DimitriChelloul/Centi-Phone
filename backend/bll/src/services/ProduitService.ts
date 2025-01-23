import { injectable, inject } from "tsyringe";
import { IProductRepository } from "../../../dal/src/dal/Interfaces/IProduitRepository";
import { IProductService } from "../Interfaces/IProduitService";
import { ProduitsAVendre } from '../../../domain/src/entities/Produits_a_vendre';
import { ProduitsReconditionnes } from '../../../domain/src/entities/appareils_reconditionnes';
import { Marques } from '../../../domain/src/entities/Marques';
import { Modele } from '../../../domain/src/entities/Modeles';
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork";
import fs from "fs/promises";


// La classe ProductService est déclarée et exportée pour être utilisée ailleurs dans l'application. 
// Elle implémente l'interface IProductService. Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class ProductService implements IProductService {

  // Le constructeur prend deux paramètres :

 // productRepo de type IProductRepository : Injecté avec le décorateur @inject("IProductRepository").
 // unitOfWork de type IUnitOfWork : Injecté avec le décorateur @inject("IUnitOfWork").
  constructor(@inject("IProductRepository") private productRepo: IProductRepository,
  @inject("IUnitOfWork") private unitOfWork: IUnitOfWork) {}

  // Cette méthode est asynchrone et retourne une promesse de type tableau de ProduitsAVendre
  async getAllProductsToSell(): Promise<ProduitsAVendre[]> {
    //appelle la méthode getAllProductsToSell du repository de produits pour récupérer tous les produits à vendre.
    return this.productRepo.getAllProductsToSell();
  }

  //Cette méthode est asynchrone et prend un paramètre productId (l'ID du produit). Elle retourne une promesse de type ProduitsAVendre ou null
  async getProductToSellById(productId: number): Promise<ProduitsAVendre | null> {
    //appelle la méthode getProductToSellById du repository de produits pour récupérer un produit à vendre par son ID.
    return this.productRepo.getProductToSellById(productId);
  }

  // Cette méthode est asynchrone et prend un paramètre produit de type ProduitsAVendre. Elle retourne une promesse de type ProduitsAVendre.
  async addProduit(produit: ProduitsAVendre): Promise<ProduitsAVendre> {
    //appelle la méthode createProduit du repository de produits pour ajouter un nouveau produit à vendre
    return this.productRepo.createProduit(produit);
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  produitId (l'ID du produit) et updatedData (les données mises à jour).
  //  Elle retourne une promesse de type ProduitsAVendre.
  async updateProduit(produitId: number, updatedData: Partial<ProduitsAVendre>): Promise<ProduitsAVendre> {
    //  La méthode getProductById du repository de produits est appelée pour récupérer le produit actuel par son ID
    const existingProduct = await this.productRepo.getProductById(produitId);
  
    //Si le produit n'est pas trouvé, une erreur est levée.
    if (!existingProduct) {
      throw new Error("Produit introuvable.");
    }
  
    //  Si une nouvelle image est fournie et qu'une ancienne image existe,
    //  l'ancienne image est supprimée en utilisant la méthode unlink du module fs. Les erreurs éventuelles sont loguées dans la console.
    if (updatedData.photoProduit && existingProduct.photoProduit) {
      try {
        await fs.unlink(existingProduct.photoProduit); // Supprimer l'ancien fichier
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ancien fichier :", error);
      }
    }
  
    //  La méthode updateProduit du repository de produits est appelée pour mettre à jour le produit avec les nouvelles données.
    return this.productRepo.updateProduit(produitId, updatedData);
  }

  // Cette méthode est asynchrone et prend un paramètre productId (l'ID du produit). Elle retourne une promesse de type void
  async deleteProduit(productId: number): Promise<void> {
    //appelle la méthode deleteProduct du repository de produits pour supprimer un produit par son ID.
    await this.productRepo.deleteProduct(productId);
  }

  // Cette méthode est asynchrone et retourne une promesse de type tableau de ProduitsReconditionnes
  async getAllRefurbishedDevices(): Promise<ProduitsReconditionnes[]> {
    //appelle la méthode getAllRefurbishedDevices du repository de produits pour récupérer tous les appareils reconditionnés.
    return this.productRepo.getAllRefurbishedDevices();
  }

  //Cette méthode est asynchrone et prend un paramètre deviceId (l'ID de l'appareil). Elle retourne une promesse de type ProduitsReconditionnes ou null
  async getRefurbishedDeviceById(deviceId: number): Promise<ProduitsReconditionnes | null> {
    //appelle la méthode getRefurbishedDeviceById du repository de produits pour récupérer un appareil reconditionné par son ID.
    return this.productRepo.getRefurbishedDeviceById(deviceId);
  }

  // Cette méthode est asynchrone et prend un paramètre device de type ProduitsReconditionnes. Elle retourne une promesse de type ProduitsReconditionnes.
  async addRefurbishedDevice(device: ProduitsReconditionnes): Promise<ProduitsReconditionnes> {
    // appelle la méthode createRefurbishedDevice du repository de produits pour ajouter un nouvel appareil reconditionné.
    return this.productRepo.createRefurbishedDevice(device);
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  deviceId (l'ID de l'appareil) et updatedData (les données mises à jour). Elle retourne une promesse de type ProduitsReconditionnes.
  async updateRefurbishedDevice(deviceId: number, updatedData: Partial<ProduitsReconditionnes>): Promise<ProduitsReconditionnes> {
    // Récupérer le produit actuel
    const existingProduct = await this.productRepo.getRefurbishedDeviceById(deviceId);
  
    if (!existingProduct) {
      throw new Error("Produit introuvable.");
    }
  
    // Si une nouvelle image est fournie, supprimer l'ancienne
    if (updatedData.photoProduit && existingProduct.photoProduit) {
      try {
        await fs.unlink(existingProduct.photoProduit); // Supprimer l'ancien fichier
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ancien fichier :", error);
      }
    }
  
    // Mettre à jour le produit
    return this.productRepo.updateRefurbishedDevices(deviceId, updatedData);
  }

  // Cette méthode est asynchrone et prend un paramètre deviceId (l'ID de l'appareil). Elle retourne une promesse de type void. 
  async deleteRefurbishedDevice(deviceId: number): Promise<void> {
    // appelle la méthode deleteRefurbishedDevice du repository de produits pour supprimer un appareil reconditionné par son ID.
    await this.productRepo.deleteRefurbishedDevice(deviceId);
  }

  //Cette méthode est asynchrone et retourne une promesse de type tableau de Marques
  async getAllBrands(): Promise<Marques[]> {
    //appelle la méthode getAllBrands du repository de produits pour récupérer toutes les marques.
    return this.productRepo.getAllBrands();
  }

  // Cette méthode est asynchrone et prend un paramètre brandId (l'ID de la marque). Elle retourne une promesse de type Marques ou null.
  async getBrandById(brandId: number): Promise<Marques | null> {
    // appelle la méthode getBrandById du repository de produits pour récupérer une marque par son ID
    return this.productRepo.getBrandById(brandId);
  }

  // Cette méthode est asynchrone et prend un paramètre brandId (l'ID de la marque). Elle retourne une promesse de type tableau de Modele
  async getAllModelsByBrand(brandId: number): Promise<Modele[]> {
    // appelle la méthode getAllModelsByBrand du repository de produits pour récupérer tous les modèles d'une marque par son ID.
    return this.productRepo.getAllModelsByBrand(brandId);
  }

  /**
   * Met à jour le stock d'un produit.
   * @param productId - ID du produit.
   * @param quantityChange - Quantité à ajouter ou retirer du stock.
   */
  async updateStock(productId: number, quantityChange: number): Promise<void> {
    await this.unitOfWork.start();

    try {
      // Appeler la méthode du ProductRepository via UnitOfWork
      await this.unitOfWork.productRepository.updateStock(productId, quantityChange);
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw new Error(`Erreur lors de la mise à jour du stock : ${(error as Error).message}`);
    }
  }

  // Cette méthode est asynchrone et prend deux paramètres : produitId (l'ID du produit) et filePath (le chemin du fichier image). Elle retourne une promesse de type void.
  async updateProductImage(produitId: number, filePath: string): Promise<void> {
    //La méthode getProductToSellById du repository de produits est appelée pour récupérer le produit par son ID
    const product = await this.productRepo.getProductToSellById(produitId);

    //Si le produit n'est pas trouvé, une erreur est levée.
    if (!product) {
      throw new Error("Produit non trouvé.");
    }

    //  Le champ photoProduit est mis à jour avec le nouveau chemin du fichier image
  const updatedData = { photoProduit: filePath };
  // La méthode updateProduit du repository de produits est appelée pour mettre à jour le produit avec les nouvelles données.
  await this.productRepo.updateProduit(produitId, updatedData);
  }

  //Cette méthode est asynchrone et prend deux paramètres :
  //  deviceId (l'ID de l'appareil) et filePath (le chemin du fichier image). Elle retourne une promesse de type void.
  async updateReconditionneImage(deviceid: number, filePath: string): Promise<void> {
    //méthode getRefurbishedDeviceById du repository de produits est appelée pour récupérer l'appareil par son ID.
    const reconditionne = await this.productRepo.getRefurbishedDeviceById(deviceid);
    //Si l'appareil n'est pas trouvé, une erreur est levée.
    if (!reconditionne) {
      throw new Error("Produit non trouvé.");
    }

    // Le champ photoProduit est mis à jour avec le nouveau chemin du fichier image.
  const updatedData = { photoProduit: filePath };
  //méthode updateRefurbishedDevices du repository de produits est appelée pour mettre à jour l'appareil avec les nouvelles données.
  await this.productRepo.updateRefurbishedDevices(deviceid, updatedData);
  }
}

