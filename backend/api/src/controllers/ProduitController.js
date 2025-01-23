import { container } from "tsyringe";
import { ProductService } from "../../../bll/src/services/ProduitService";
export class ProductController {
    constructor() {
        // Récupérer tous les produits à vendre
        this.getAllProductsToSell = async (req, res, next) => {
            try {
                const products = await this.productService.getAllProductsToSell();
                res.status(200).json(products);
            }
            catch (error) {
                next(error);
            }
        };
        // Ajouter un produit
        this.addProduct = async (req, res, next) => {
            try {
                const produit = req.body;
                const newProduct = await this.productService.addProduit(produit);
                res.status(201).json(newProduct);
            }
            catch (error) {
                next(error);
            }
        };
        // Mettre à jour le stock d'un produit
        this.updateStock = async (req, res, next) => {
            const { productId, quantityChange } = req.body;
            try {
                await this.productService.updateStock(Number(productId), Number(quantityChange));
                res.status(200).json({ message: "Stock mis à jour avec succès." });
            }
            catch (error) {
                next(error);
            }
        };
        // Supprimer un produit
        this.deleteProduct = async (req, res, next) => {
            const productId = Number(req.params.id);
            try {
                await this.productService.deleteProduit(productId);
                res.status(200).json({ message: "Produit supprimé avec succès." });
            }
            catch (error) {
                next(error);
            }
        };
        this.productService = container.resolve(ProductService);
    }
}
