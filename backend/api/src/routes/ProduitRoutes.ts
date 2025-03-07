import express from "express";
import { ProductController } from "../controllers/ProduitController";
import { handleValidationErrors, validateProduct, validateStockUpdate } from "../middleware/ProduitValidation";
import { authenticateToken } from "../middleware/authenticateToken";

import upload from "../../src/Utils/upload";
import multer from "multer";
import { validateRefurbishedDevice } from "../middleware/reconditionnesValidation";
import { checkRole } from "../middleware/checkRole";


//Un routeur Express est créé pour définir les routes de l'application.
const router = express.Router();

// Une instance de ProductController est créée pour accéder aux méthodes du contrôleur.
const productController = new ProductController();


//  La variable storage est déclarée et configurée en utilisant la méthode diskStorage de Multer
const storage = multer.diskStorage({
  // La fonction destination est utilisée pour définir le répertoire où les fichiers uploadés seront stockés.
  //  Elle prend trois paramètres : req (la requête), file (les informations du fichier), et cb (la fonction de rappel).
  destination: (req, file, cb) => {
    // La fonction de rappel cb est appelée avec null comme premier argument (indiquant qu'il n'y a pas d'erreur)
    //  et "uploads/products" comme deuxième argument, indiquant que les fichiers seront stockés dans le répertoire uploads/products.
    cb(null, "uploads/products"); // Répertoire pour stocker les images
  },
  // La fonction filename est utilisée pour définir le nom de fichier unique pour chaque fichier uploadé.
  filename: (req, file, cb) => {
    // La fonction de rappel cb est appelée avec null comme premier argument (indiquant qu'il n'y a pas d'erreur) et une chaîne de caractères comme deuxième argument. Cette chaîne de caractères est composée de la date actuelle en millisecondes (Date.now())
    //  suivie du nom original du fichier (file.originalname), ce qui garantit un nom unique pour chaque fichier uploadé.
    cb(null, `${Date.now()}-${file.originalname}`); // Nom unique pour chaque fichier
  },
});
// La variable Upload est déclarée et configurée en utilisant la fonction multer avec l'objet storage défini précédemment.
const Upload = multer({ storage });

// Routes pour les produits

//Définition de la route /produits :
//Méthode HTTP : GET
//Chemin : /produits
//Contrôleur : productController.getAllProductsToSell : Méthode du contrôleur pour récupérer tous les produits à vendre.
router.get("/produits", productController.getAllProductsToSell);

// Route pour ajouter les appareils reconditionnes
router.get("/appareilsreconditionnes", productController.getAllRefurbishedDevices);


//Définition de la route /produits :
//Méthode HTTP : POST
//Chemin : /produits
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
  //  csrfProtection : Protège contre les attaques CSRF.
  //  validateProduct : Valide les données pour ajouter un produit.
  //  handleValidationErrors : Gère les erreurs de validation.
//Contrôleur : productController.addProduct : Méthode du contrôleur pour ajouter un produit.
router.post(
  "/produits",
  authenticateToken,
  checkRole("admin"),
  validateProduct, // Exécution des règles de validation
  handleValidationErrors, // Gestion des erreurs de validation
  Upload.single("photoProduit"), // Middleware pour gérer une seule image
  productController.addProduct // Appeler le contrôleur
);

router.post(
  "/appareils-reconditionnes",
  authenticateToken,
  checkRole("admin"),
  upload.single("photoProduit"), // Middleware pour gérer l'upload d'image
  validateRefurbishedDevice,    // Middleware de validation (à définir)
  handleValidationErrors,       // Gestion des erreurs de validation
  productController.addRefurbishedProduct
);


// Route pour mettre à jour le stock

//Définition de la route /produits/stock :
//Méthode HTTP : PUT
//Chemin : /produits/stock
//Middlewares :
   // authenticateToken : Authentifie le token JWT pour protéger la route.
   // csrfProtection : Protège contre les attaques CSRF.
   // validateStockUpdate : Valide les données pour mettre à jour le stock.
   // handleValidationErrors : Gère les erreurs de validation.
//Contrôleur : productController.updateStock : Méthode du contrôleur pour mettre à jour le stock d'un produit.

router.put(
    "/produits/stock",
    authenticateToken,
    validateStockUpdate,      // Règles de validation
    handleValidationErrors,   // Gestion des erreurs
    productController.updateStock
  );

  //Route pour supprimer un produit
  
 // Définition de la route /products/:id :
 // Méthode HTTP : DELETE
  //Chemin : /products/:id
  //Middlewares :
    //  authenticateToken : Authentifie le token JWT pour protéger la route.
     // csrfProtection : Protège contre les attaques CSRF.
  //Contrôleur : productController.deleteProduct : Méthode du contrôleur pour supprimer un produit.

router.delete("/products/:id", authenticateToken,checkRole("admin"), productController.deleteProduct);

//Definition de la route /reconditionne/:id
//Methode HTTP : DELETE
//Chemin /reconditionne/:id
//Middlewares : 
//authenticateToken : Authentifie le token JWT pour protéger la route.
//csrfProtection : Protège contre les attaques CSRF.
// Controleur : productController.deleteReconditionne : methode du controleur pour supprimer un appareil reconditionne
router.delete("/reconditionne/:id", authenticateToken,checkRole("admin"),productController.deleteReconditionne);

//Definition de la route /upload-image
//Methode HTTP : post
//Chemin /upload-image
//Middlewares : 
// upload.single("image") est utilisé pour gérer l'upload de fichiers. Il s'attend à ce que le fichier soit envoyé avec le nom de champ image.
// Controleur :   La méthode uploadProductImage du contrôleur productController est appelée pour gérer l'upload de l'image du produit.
//  La méthode bind(productController) est utilisée pour s'assurer que this dans la méthode uploadProductImage fait référence à l'instance de productController.
router.post(
  "/upload-image",
  upload.single("image"), // Middleware pour l'upload
  productController.uploadProductImage.bind(productController)
);

//Definition de la route /upload-reconditionneimage
//Methode HTTP : post
//Chemin : /upload-reconditionneimage
//Middleware : 
// upload.single("image") est utilisé pour gérer l'upload de fichiers. Il s'attend à ce que le fichier soit envoyé avec le nom de champ image.
// Controleur :  La méthode uploadReconditionneImage du contrôleur productController est appelée pour gérer l'upload de l'image de l'appareil reconditionné.
//  La méthode bind(productController) est utilisée pour s'assurer que this dans la méthode uploadReconditionneImage fait référence à l'instance de productController.
router.post(
  "/upload-reconditionneimage",
  upload.single("image"), // Middleware pour l'upload
  productController.uploadReconditionneImage.bind(productController)
);

//Le routeur est exporté par défaut pour être utilisé ailleurs dans l'application.
export default router;
