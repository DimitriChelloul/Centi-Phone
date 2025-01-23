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
var _a, _b;
import { injectable, inject } from "tsyringe";
import { IProductRepository } from "../../../dal/src/dal/Interfaces/IProduitRepository";
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork";
let ProductService = class ProductService {
    constructor(productRepo, unitOfWork) {
        this.productRepo = productRepo;
        this.unitOfWork = unitOfWork;
    }
    async getAllProductsToSell() {
        return this.productRepo.getAllProductsToSell();
    }
    async getProductToSellById(productId) {
        return this.productRepo.getProductToSellById(productId);
    }
    async addProduit(produit) {
        return this.productRepo.createProduit(produit);
    }
    async updateProduit(produit) {
        return this.productRepo.updateProduit(produit);
    }
    async deleteProduit(productId) {
        await this.productRepo.deleteProduct(productId);
    }
    async getAllRefurbishedDevices() {
        return this.productRepo.getAllRefurbishedDevices();
    }
    async getRefurbishedDeviceById(deviceId) {
        return this.productRepo.getRefurbishedDeviceById(deviceId);
    }
    async addRefurbishedDevice(device) {
        return this.productRepo.createRefurbishedDevice(device);
    }
    async updateRefurbishedDevice(device) {
        return this.productRepo.updateRefurbishedDevice(device);
    }
    async deleteRefurbishedDevice(deviceId) {
        await this.productRepo.deleteRefurbishedDevice(deviceId);
    }
    async getAllBrands() {
        return this.productRepo.getAllBrands();
    }
    async getBrandById(brandId) {
        return this.productRepo.getBrandById(brandId);
    }
    async getAllModelsByBrand(brandId) {
        return this.productRepo.getAllModelsByBrand(brandId);
    }
    /**
     * Met à jour le stock d'un produit.
     * @param productId - ID du produit.
     * @param quantityChange - Quantité à ajouter ou retirer du stock.
     */
    async updateStock(productId, quantityChange) {
        await this.unitOfWork.start();
        try {
            // Appeler la méthode du ProductRepository via UnitOfWork
            await this.unitOfWork.productRepository.updateStock(productId, quantityChange);
            await this.unitOfWork.commit();
        }
        catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Erreur lors de la mise à jour du stock : ${error.message}`);
        }
    }
};
ProductService = __decorate([
    injectable(),
    __param(0, inject("IProductRepository")),
    __param(1, inject("IUnitOfWork")),
    __metadata("design:paramtypes", [typeof (_a = typeof IProductRepository !== "undefined" && IProductRepository) === "function" ? _a : Object, typeof (_b = typeof IUnitOfWork !== "undefined" && IUnitOfWork) === "function" ? _b : Object])
], ProductService);
export { ProductService };
