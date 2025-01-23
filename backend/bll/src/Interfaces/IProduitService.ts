import { ProduitsAVendre } from '../../../domain/src/entities/Produits_a_vendre';
import { ProduitsReconditionnes } from '../../../domain/src/entities/appareils_reconditionnes';
import { Marques } from '../../../domain/src/entities/Marques';
import { Modele } from '../../../domain/src/entities/Modeles';

export interface IProductService {
  // Produits à vendre
  getAllProductsToSell(): Promise<ProduitsAVendre[]>;
  getProductToSellById(productId: number): Promise<ProduitsAVendre | null>;
  addProduit(produit: ProduitsAVendre): Promise<ProduitsAVendre>;
  updateProduit(produitId: number, updatedData: Partial<ProduitsAVendre>): Promise<ProduitsAVendre>
  deleteProduit(productId: number): Promise<void>;
  updateStock(productId: number, quantityChange: number): Promise<void>;
  updateProductImage(produitId: number, filePath: string): Promise<void>;

  // Appareils reconditionnés
  getAllRefurbishedDevices(): Promise<ProduitsReconditionnes[]>;
  getRefurbishedDeviceById(deviceId: number): Promise<ProduitsReconditionnes | null>;
  addRefurbishedDevice(device: ProduitsReconditionnes): Promise<ProduitsReconditionnes>;
  updateRefurbishedDevice(deviceId: number, updatedData: Partial<ProduitsReconditionnes>): Promise<ProduitsReconditionnes>
  deleteRefurbishedDevice(deviceId: number): Promise<void>;
  updateReconditionneImage(deviceid: number, filePath: string): Promise<void>

  // Marques et modèles
  getAllBrands(): Promise<Marques[]>;
  getBrandById(brandId: number): Promise<Marques | null>;
  getAllModelsByBrand(brandId: number): Promise<Modele[]>;
}
