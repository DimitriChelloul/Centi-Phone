import express from "express";
import { ReparationController } from "../controllers/ReparationController";
import { handleValidationErrors, validateCreateRdv, validateUpdateStatut } from "../middleware/ReparationValidation";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";
const router = express.Router();
const reparationController = new ReparationController();
// Créer un rendez-vous
router.post("/rdv", authenticateToken, csrfProtection, handleValidationErrors, validateCreateRdv, reparationController.createRdv);
// Ajouter un suivi de réparation
router.post("/suivi", authenticateToken, csrfProtection, reparationController.addSuiviReparation);
// Mettre à jour le statut d'une réparation
router.put("/statut", authenticateToken, csrfProtection, handleValidationErrors, validateUpdateStatut, reparationController.updateStatutReparation);
// Créer un devis
router.post("/devis", authenticateToken, csrfProtection, reparationController.createDevis);
export default router;
