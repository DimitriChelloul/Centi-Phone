import express from "express";
import { ReparationController } from "../controllers/ReparationController";
import { handleValidationErrors, validateCreateRdv, validateUpdateStatut } from "../middleware/ReparationValidation";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";
import { checkRole } from "../middleware/checkRole";


// Un routeur Express est créé pour définir les routes de l'application.
const router = express.Router();

// Une instance de ReparationController est créée pour accéder aux méthodes du contrôleur.
const reparationController = new ReparationController();

// Créer un rendez-vous
//Définition de la route /rdv :
//Méthode HTTP : POST
//Chemin : /rdv
//Middlewares :
//authenticateToken : Authentifie le token JWT pour protéger la route.
//csrfProtection : Protège contre les attaques CSRF.
//handleValidationErrors : Gère les erreurs de validation.
//validateCreateRdv : Valide les données pour créer un rendez-vous.
//Contrôleur : reparationController.createRdv : Méthode du contrôleur pour créer un rendez-vous.
router.post("/rdv", authenticateToken,csrfProtection,handleValidationErrors, validateCreateRdv, reparationController.createRdv);

// Ajouter un suivi de réparation
//Definition de la route /suivi
//Methode HTTP : POST
//Chemin : /suivi
//Middleware : 
//authenticateToken : Authentifie le token JWT pour protéger la route.
//csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : reparationController.addSuiviReparation : Méthode du contrôleur pour ajouter un suivi de réparation.
router.post("/suivi", authenticateToken,checkRole("admin"),csrfProtection, reparationController.addSuiviReparation);

// Mettre à jour le statut d'une réparation
//Defintion de la route /statut
//Methode HTTP : PUT
//Chemin : /statut
//Middlewares : 
//authenticateToken : Authentifie le token JWT pour protéger la route.
//csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : reparationController.updateStatutReparation : Méthode du contrôleur pour mettre à jour le statut d'une réparation.
router.put("/statut", authenticateToken,checkRole("admin"),csrfProtection,handleValidationErrors, validateUpdateStatut, reparationController.updateStatutReparation);

// Créer un devis
//Definition de la route /devis
//Methode HTTP : POST
//Cheùin : /devis
//Middlewares : 
//authenticateToken : Authentifie le token JWT pour protéger la route.
//csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : reparationController.createDevis : Méthode du contrôleur pour créer un devis.
router.post("/devis", authenticateToken,checkRole("admin"),csrfProtection, reparationController.createDevis);

//Le routeur est exporté par défaut pour être utilisé ailleurs dans l'application.
export default router;
