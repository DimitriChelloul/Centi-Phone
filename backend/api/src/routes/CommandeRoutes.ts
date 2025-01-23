import express from "express";
import { CommandeController } from "../controllers/CommandeController";
import { validateCreateCommande, validateCommandeId } from "../middleware/CommandeValidation";
import { authenticateToken } from "../middleware/authenticateToken";
import { csrfProtection } from "../middleware/csrf";

//Un routeur Express est créé pour définir les routes de l'application.
const router = express.Router();

//Une instance de CommandeController est créée pour accéder aux méthodes du contrôleur.
const commandeController = new CommandeController();

// Routes pour les commandes


//Définition de la route / :
//Méthode HTTP : POST
//Chemin : /
//Middlewares :
    //authenticateToken : Authentifie le token JWT pour protéger la route.
    //csrfProtection : Protège contre les attaques CSRF.
    //validateCreateCommande : Valide les données pour créer une commande.
//Contrôleur : commandeController.createCommande : Méthode du contrôleur pour créer une commande.
router.post("/", authenticateToken,csrfProtection, validateCreateCommande, commandeController.createCommande);


//Définition de la route /:commandeId :
//Méthode HTTP : GET
//Chemin : /:commandeId
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
   // validateCommandeId : Valide l'ID de la commande.
//Contrôleur : commandeController.getCommandeById : Méthode du contrôleur pour récupérer une commande par son ID.
router.get("/:commandeId", authenticateToken,csrfProtection, validateCommandeId, commandeController.getCommandeById);


//Définition de la route /user/:utilisateurId :
//Méthode HTTP : GET
//Chemin : /user/:utilisateurId
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : commandeController.getCommandesByUserId : Méthode du contrôleur pour récupérer les commandes d'un utilisateur par son ID.
router.get("/user/:utilisateurId", authenticateToken,csrfProtection, commandeController.getCommandesByUserId);


//Définition de la route /:commandeId :
//Méthode HTTP : DELETE
//Chemin : /:commandeId
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
   // validateCommandeId : Valide l'ID de la commande.
//Contrôleur : commandeController.cancelCommande : Méthode du contrôleur pour annuler une commande.
router.delete("/:commandeId", authenticateToken,csrfProtection, validateCommandeId, commandeController.cancelCommande);


//Définition de la route /:commandeId/details :
//Méthode HTTP : POST
//Chemin : /:commandeId/details
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : commandeController.addCommandeDetail : Méthode du contrôleur pour ajouter un détail à une commande.
router.post("/:commandeId/details", authenticateToken,csrfProtection, commandeController.addCommandeDetail);


//Définition de la route /:commandeId/details :
//Méthode HTTP : GET
//Chemin : /:commandeId/details
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
   // validateCommandeId : Valide l'ID de la commande.
//Contrôleur : commandeController.getCommandeDetails : Méthode du contrôleur pour récupérer les détails d'une commande.
router.get("/:commandeId/details", authenticateToken,csrfProtection, validateCommandeId, commandeController.getCommandeDetails);

// Routes pour les livraisons


//Définition de la route /livraison :
//Méthode HTTP : POST
//Chemin : /livraison
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : commandeController.createLivraison : Méthode du contrôleur pour créer une livraison.
router.post("/livraison", authenticateToken,csrfProtection, commandeController.createLivraison);


//Définition de la route /livraison/options :
//Méthode HTTP : GET
//Chemin : /livraison/options
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
//Contrôleur : commandeController.getAllDeliveryOptions : Méthode du contrôleur pour récupérer toutes les options de livraison.
router.get("/livraison/options", authenticateToken,csrfProtection, commandeController.getAllDeliveryOptions);

// Créer une commande et initier un paiement


//Définition de la route /create-and-pay :
//Méthode HTTP : POST
//Chemin : /create-and-pay
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
   // validateCreateCommande : Valide les données pour créer une commande.
//Contrôleur : commandeController.createCommandeAndProcessPayment : Méthode du contrôleur pour créer une commande et initier un paiement.
router.post(
    "/create-and-pay",
    authenticateToken,
    csrfProtection,
    validateCreateCommande,
    commandeController.createCommandeAndProcessPayment
  );
  
  // Valider un paiement
  
  //Définition de la route /validate-payment :
  //Méthode HTTP : POST
  //Chemin : /validate-payment
  //Middlewares :
     // authenticateToken : Authentifie le token JWT pour protéger la route.
     // csrfProtection : Protège contre les attaques CSRF.
  //Contrôleur : commandeController.validatePayment : Méthode du contrôleur pour valider un paiement.
router.post(
    "/validate-payment",
    authenticateToken,
    csrfProtection,
    commandeController.validatePayment
  );

  // Le routeur est exporté par défaut pour être utilisé ailleurs dans l'application.
export default router;
