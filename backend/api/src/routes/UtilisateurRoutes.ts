import express from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/authenticateToken";
import {utilisateurController} from "../controllers/UtilisateurController";
import {validateRegister,validateLogin} from "../middleware/UtilisateurValidation";
import { csrfProtection } from "../middleware/csrf";
import { checkRole } from "../middleware/checkRole";


//Un routeur Express est créé pour définir les routes de l'application.
const router = express.Router();



// Routes publiques
//Définition de la route /register :
//Chemin : /register
//Middlewares :
//validateRegister : Valide les données d'inscription.
//csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : utilisateurController.register : Méthode du contrôleur pour enregistrer un nouvel utilisateur.
router.post("/register", validateRegister,csrfProtection, utilisateurController.register);
//Définition de la route /register :
//Chemin : /register
//Middlewares :
//validateLogin : Valide les données de connexioin.
//csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : utilisateurController.login : Méthode du contrôleur pour connecter un utilisateur.
router.post("/login", validateLogin,csrfProtection, utilisateurController.login);

// Routes protégées
//Définition de la route /profile :
//Méthode HTTP : GET
//Chemin : /profile
//Middlewares :
//authenticateToken : Authentifie le token JWT pour protéger la route.
//csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : utilisateurController.getProfile : Méthode du contrôleur pour récupérer le profil de l'utilisateur.
router.get("/profile", authenticateToken,csrfProtection, utilisateurController.getProfile);

router.get(
  "/utilisateurs",
  authenticateToken,
  checkRole("admin"),
  csrfProtection,
  utilisateurController.getAllUser // Appeler le contrôleur
);

router.delete(
    "/utilisateurs/:id",
    authenticateToken,
    checkRole("admin"),
    csrfProtection,
    utilisateurController.deleteUser // Appeler le contrôleur
  );

  router.get("/:utilisateurId", authenticateToken,checkRole("admin"),csrfProtection,utilisateurController.getUserById);

  router.put("/:id", authenticateToken, checkRole("admin"), csrfProtection, utilisateurController.updateUser);

//Exportation du routeur : Le routeur est exporté par défaut pour être utilisé ailleurs dans l'application.
export default router;
