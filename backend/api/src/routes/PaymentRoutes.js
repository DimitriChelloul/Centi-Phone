import express from "express";
import { createPayment, validatePayment } from "../controllers/PaymentController";
import { handleValidationErrors, validateCreatePayment, validateValidatePayment } from "../middleware/ValidatePayment";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";
const router = express.Router();
// Route pour la création de paiement
router.post("/create-payment", authenticateToken, csrfProtection, validateCreatePayment, // Exécute les règles de validation
handleValidationErrors, // Vérifie et renvoie les erreurs si présentes
createPayment // Contrôleur principal
);
// Route pour la validation de paiement
router.post("/validate-payment", authenticateToken, csrfProtection, validateValidatePayment, // Exécute les règles de validation
handleValidationErrors, // Vérifie et renvoie les erreurs si présentes
validatePayment // Contrôleur principal
);
export default router;
