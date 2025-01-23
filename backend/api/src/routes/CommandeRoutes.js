import express from "express";
import { CommandeController } from "../controllers/CommandeController";
import { validateCreateCommande, validateCommandeId } from "../middleware/CommandeValidation";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";
const router = express.Router();
const commandeController = new CommandeController();
// Routes pour les commandes
router.post("/", authenticateToken, csrfProtection, validateCreateCommande, commandeController.createCommande);
router.get("/:commandeId", authenticateToken, csrfProtection, validateCommandeId, commandeController.getCommandeById);
router.get("/user/:utilisateurId", authenticateToken, csrfProtection, commandeController.getCommandesByUserId);
router.delete("/:commandeId", authenticateToken, csrfProtection, validateCommandeId, commandeController.cancelCommande);
router.post("/:commandeId/details", authenticateToken, csrfProtection, commandeController.addCommandeDetail);
router.get("/:commandeId/details", authenticateToken, csrfProtection, validateCommandeId, commandeController.getCommandeDetails);
// Routes pour les livraisons
router.post("/livraison", authenticateToken, csrfProtection, commandeController.createLivraison);
router.get("/livraison/options", authenticateToken, csrfProtection, commandeController.getAllDeliveryOptions);
// Créer une commande et initier un paiement
router.post("/create-and-pay", authenticateToken, csrfProtection, validateCreateCommande, commandeController.createCommandeAndProcessPayment);
// Valider un paiement
router.post("/validate-payment", authenticateToken, csrfProtection, commandeController.validatePayment);
export default router;
