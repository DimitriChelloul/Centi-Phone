import express from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { utilisateurController } from "../controllers/UtilisateurController";
import { validateRegister, validateLogin } from "../middleware/UtilisateurValidation";
import { csrfProtection } from "../middleware/csrf";
const router = express.Router();
// Routes publiques
router.post("/register", validateRegister, csrfProtection, utilisateurController.register);
router.post("/login", validateLogin, csrfProtection, utilisateurController.login);
// Routes protégées
router.get("/profile", authenticateToken, csrfProtection, utilisateurController.getProfile);
export default router;
