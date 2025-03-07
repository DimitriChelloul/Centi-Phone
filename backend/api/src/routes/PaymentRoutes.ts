import express from "express";
import { createPayment, validatePayment } from "../controllers/PaymentController";
import { handleValidationErrors, validateCreatePayment, validateValidatePayment } from "../middleware/ValidatePayment";
import { authenticateToken } from "../middleware/authenticateToken";


//Un routeur Express est créé pour définir les routes de l'application.
const router = express.Router();

// Route pour la création de paiement

//Définition de la route /create-payment :
//Méthode HTTP : POST
//Chemin : /create-payment
//Middlewares :
  //  authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
   // validateCreatePayment : Valide les données pour créer un paiement.
   // handleValidationErrors : Gère les erreurs de validation.
//Contrôleur : createPayment : Méthode du contrôleur pour créer un paiement.

router.post(
    "/create-payment",
    authenticateToken,
    validateCreatePayment, // Exécute les règles de validation
    handleValidationErrors, // Vérifie et renvoie les erreurs si présentes
    createPayment // Contrôleur principal
  );
  
  // Route pour la validation de paiement
  
 // Définition de la route /validate-payment :
 // Méthode HTTP : POST
 // Chemin : /validate-payment
 // Middlewares :
     // authenticateToken : Authentifie le token JWT pour protéger la route.
     // csrfProtection : Protège contre les attaques CSRF.
     // validateValidatePayment : Valide les données pour valider un paiement.
     // handleValidationErrors : Gère les erreurs de validation.
  //Contrôleur : validatePayment : Méthode du contrôleur pour valider un paiement.

  router.post(
    "/validate-payment",
    authenticateToken,
    validateValidatePayment, // Exécute les règles de validation
    handleValidationErrors, // Vérifie et renvoie les erreurs si présentes
    validatePayment // Contrôleur principal
  );

  // Le routeur est exporté par défaut pour être utilisé ailleurs dans l'application.
export default router;
