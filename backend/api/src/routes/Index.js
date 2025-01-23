import express from "express";
import utilisateurRoutes from "../routes/UtilisateurRoutes";
import paymentRoutes from "../routes/PaymentRoutes";
import reparationRoutes from "./ReparationRoutes";
import commandeRoutes from "../routes/CommandeRoutes";
import produitRoutes from "../routes/ProduitRoutes";
import AvisRoutes from "../routes/AvisRoutes";
const router = express.Router();
// Ajouter toutes les routes au routeur principal
router.use("/utilisateurs", utilisateurRoutes);
// Routes pour les paiements
router.use("/payments", paymentRoutes);
//router.use("/products", produitRoutes);
router.use("/reparations", reparationRoutes);
// Monter les routes pour les avis
router.use("/reviews", AvisRoutes);
// Routes pour les commandes
router.use("/commandes", commandeRoutes);
router.use("/produits", produitRoutes);
export default router;
