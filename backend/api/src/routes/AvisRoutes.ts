import express from "express";
import { AvisController } from "../controllers/AvisController";
import { handleValidationErrors, validateCreateReview, validateIdParam } from "../middleware/AvisValidation";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";
import { checkRole } from "../middleware/checkRole";

//Un routeur Express est créé pour définir les routes de l'application.
const router = express.Router();

//Une instance de AvisController est créée pour accéder aux méthodes du contrôleur.
const avisController = new AvisController();

// Créer un avis

//Définition de la route /reviews :
//Méthode HTTP : POST
//Chemin : /reviews
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
  //  validateCreateReview : Valide les données pour créer un avis.
   // csrfProtection : Protège contre les attaques CSRF.
  //  handleValidationErrors : Gère les erreurs de validation.
//Contrôleur : avisController.createReview : Méthode du contrôleur pour créer un avis.
router.post(
  "/reviews",
  authenticateToken,
  validateCreateReview,
  csrfProtection,
  handleValidationErrors,
  avisController.createReview
);

// Récupérer les avis d'un produit ou appareil

//Définition de la route /reviews/product/:productId :
//Méthode HTTP : GET
//Chemin : /reviews/product/:productId
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : avisController.getReviewsByProductId : Méthode du contrôleur pour récupérer les avis d'un produit ou appareil par son ID.
router.get(
  "/reviews/product/:productId",
  authenticateToken,
  csrfProtection,
  avisController.getReviewsByProductId
);

// Récupérer un avis par ID

//Définition de la route /reviews/:reviewId :
//Méthode HTTP : GET
//Chemin : /reviews/:reviewId
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // validateIdParam : Valide l'ID de l'avis.
   // csrfProtection : Protège contre les attaques CSRF.
   // handleValidationErrors : Gère les erreurs de validation.
//Contrôleur : avisController.getReviewById : Méthode du contrôleur pour récupérer un avis par son ID.
router.get(
  "/reviews/:reviewId",
  authenticateToken,
  validateIdParam,
  csrfProtection,
  handleValidationErrors,
  avisController.getReviewById
);

// Supprimer un avis

//Définition de la route /reviews/:reviewId :
//Méthode HTTP : DELETE
//Chemin : /reviews/:reviewId
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // validateIdParam : Valide l'ID de l'avis.
   // csrfProtection : Protège contre les attaques CSRF.
   // handleValidationErrors : Gère les erreurs de validation.
//Contrôleur : avisController.deleteReview : Méthode du contrôleur pour supprimer un avis par son ID.
router.delete(
  "/reviews/:reviewId",
  authenticateToken,
  checkRole("admin"),
  validateIdParam,
  csrfProtection,
  handleValidationErrors,
  avisController.deleteReview
);

//Le routeur est exporté par défaut pour être utilisé ailleurs dans l'application.
export default router;
