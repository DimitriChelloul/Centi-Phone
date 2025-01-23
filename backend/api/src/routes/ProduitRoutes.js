import express from "express";
import { ProductController } from "../controllers/ProduitController";
import { handleValidationErrors, validateProduct, validateStockUpdate } from "../middleware/ProduitValidation";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";
const router = express.Router();
const productController = new ProductController();
// Routes pour les produits
router.get("/produits", authenticateToken, productController.getAllProductsToSell);
// Route pour ajouter un produit
router.post("/produits", authenticateToken, csrfProtection, validateProduct, // Exécution des règles de validation
handleValidationErrors, // Gestion des erreurs de validation
productController.addProduct);
// Route pour mettre à jour le stock
router.put("/produits/stock", authenticateToken, csrfProtection, validateStockUpdate, // Règles de validation
handleValidationErrors, // Gestion des erreurs
productController.updateStock);
router.delete("/products/:id", authenticateToken, csrfProtection, productController.deleteProduct);
export default router;
