import express from "express";
import { AvisController } from "../controllers/AvisController";
import { handleValidationErrors, validateCreateReview, validateIdParam } from "../middleware/AvisValidation";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";
const router = express.Router();
const avisController = new AvisController();
// Créer un avis
router.post("/reviews", authenticateToken, validateCreateReview, csrfProtection, handleValidationErrors, avisController.createReview);
// Récupérer les avis d'un produit ou appareil
router.get("/reviews/product/:productId", authenticateToken, csrfProtection, avisController.getReviewsByProductId);
// Récupérer un avis par ID
router.get("/reviews/:reviewId", authenticateToken, validateIdParam, csrfProtection, handleValidationErrors, avisController.getReviewById);
// Supprimer un avis
router.delete("/reviews/:reviewId", authenticateToken, validateIdParam, csrfProtection, handleValidationErrors, avisController.deleteReview);
export default router;
