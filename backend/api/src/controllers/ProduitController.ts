import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ProductService } from "../../../bll/src/services/ProduitService";
import { ProduitsAVendre } from "../../../domain/src/entities/Produits_a_vendre";
import { ProduitsReconditionnes } from "../../../domain/src/entities/appareils_reconditionnes";
import upload from "../../../api/src/Utils/upload";

export class ProductController {
  // Cette propriété est privée et de type ProductService. Elle sera utilisée pour accéder aux méthodes du service de produit.
  private productService: ProductService;
//
  constructor() {
    // Le constructeur initialise la propriété productService en utilisant le conteneur de dépendances tsyringe pour résoudre une instance de ProductService.
    this.productService = container.resolve(ProductService);
  }

  // Récupérer tous les produits à vendre
  //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  getAllProductsToSell = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // La méthode getAllProductsToSell du service ProductService est appelée pour récupérer tous les produits à vendre
      const products = await this.productService.getAllProductsToSell();
      //Si l'appel au service réussit, une réponse JSON avec les produits est renvoyée avec le statut 200
      res.status(200).json(products);
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

   // Récupérer tous les produits à vendre
  //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  getAllRefurbishedDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // La méthode getAllProductsToSell du service ProductService est appelée pour récupérer tous les produits à vendre
      const refurbishedDevices = await this.productService.getAllRefurbishedDevices();
      //Si l'appel au service réussit, une réponse JSON avec les produits est renvoyée avec le statut 200
      res.status(200).json(refurbishedDevices);
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Ajouter un produit
  //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Les données du produit sont extraites du corps de la requête (req.body)
      //  et typées comme Partial<ProduitsAVendre>, ce qui signifie que toutes les propriétés ne sont pas nécessairement fournies.
      const produit: Partial<ProduitsAVendre> = req.body;

      //  Si un fichier a été uploadé (req.file n'est pas undefined),
      //  le chemin du fichier uploadé (req.file.path) est ajouté à la propriété photoProduit du produit.
      if (req.file) {
        produit.photoProduit = req.file.path; // Chemin du fichier uploadé
      }

      // La méthode addProduit du service productService est appelée pour ajouter le nouveau produit. Le produit est typé comme ProduitsAVendre.
      const newProduct = await this.productService.addProduit(produit as ProduitsAVendre);

      // Si l'ajout du produit réussit, une réponse JSON avec le nouveau produit est renvoyée avec le statut 201 (Créé).
      res.status(201).json(newProduct);
    } catch (error) {
      // Si une erreur se produit, elle est capturée dans le bloc catch et passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  //  Cette méthode est asynchrone et prend trois paramètres : 
  // req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
  //  Elle est utilisée pour ajouter un nouvel appareil reconditionné.
addRefurbishedProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Les données de l'appareil sont extraites du corps de la requête (req.body) et typées comme Partial<ProduitsReconditionnes>,
    //  ce qui signifie que toutes les propriétés ne sont pas nécessairement fournies.
    const appareil: Partial<ProduitsReconditionnes> = req.body;

    // Si une image a été uploadée, ajouter son chemin à l'appareil
    if (req.file) {
      appareil.photoProduit = req.file.path; // Chemin du fichier uploadé
    }

    // Appeler le service pour ajouter l'appareil reconditionné
    const newRefurbishedProduct = await this.productService.addRefurbishedDevice(appareil as ProduitsReconditionnes);

    //Si l'ajout de l'appareil reconditionné réussit, une réponse JSON avec le nouvel appareil reconditionné est renvoyée avec le statut 201 (Créé).
    res.status(201).json(newRefurbishedProduct);
  } catch (error) {
    //Si une erreur se produit, elle est capturée dans le bloc catch et passée à la fonction next pour être gérée par le middleware d'erreur.
    next(error);
  }
};


  // Mettre à jour le stock d'un produit
  //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  updateStock = async (req: Request, res: Response, next: NextFunction) => {
    // Les propriétés productId et quantityChange sont extraites du corps de la requête.
    const { productId, quantityChange } = req.body;
    try {
      //La méthode updateStock du service ProductService est appelée avec les données extraites converties en nombres.
      await this.productService.updateStock(Number(productId), Number(quantityChange));
      //Si l'appel au service réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 200.
      res.status(200).json({ message: "Stock mis à jour avec succès." });
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Supprimer un produit
  //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    // La propriété productId est extraite des paramètres de la requête et convertie en nombre
    const productId = Number(req.params.id);
    try {
      // La méthode deleteProduit du service ProductService est appelée avec l'ID du produit.
      await this.productService.deleteProduit(productId);
      //Si l'appel au service réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 200.
      res.status(200).json({ message: "Produit supprimé avec succès." });
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

    // Supprimer un produit
  //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs
  deleteReconditionne = async (req: Request, res: Response, next: NextFunction) => {
    // La propriété productId est extraite des paramètres de la requête et convertie en nombre
    const reconditionneId = Number(req.params.id);
    try {
      // La méthode deleteProduit du service ProductService est appelée avec l'ID du produit.
      await this.productService.deleteRefurbishedDevice(reconditionneId);
      //Si l'appel au service réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 200.
      res.status(200).json({ message: "Produit supprimé avec succès." });
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

 // Cette méthode est asynchrone et prend deux paramètres : req (la requête) et res (la réponse)
 async uploadProductImage(req: Request, res: Response): Promise<void> {
  try {
    // Si aucun fichier n'est fourni dans la requête, une réponse JSON avec un message d'erreur est renvoyée avec le statut 400 (Mauvaise requête)
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier fourni." });
      return;
    }
    // L'ID du produit (produitId) est extrait du corps de la requête (req.body).
    const { produitId } = req.body; 
    // Le chemin du fichier uploadé est créé en utilisant le nom du fichier (req.file.filename) et en le préfixant avec /uploads/.
    const filePath = `/uploads/${req.file.filename}`;

    //  La méthode updateProductImage du service productService est appelée
    //  pour mettre à jour le chemin de l'image du produit dans la base de données avec l'ID du produit et le chemin du fichier.
    await this.productService.updateProductImage(produitId, filePath);

    // Si l'upload et la mise à jour réussissent, une réponse JSON avec un message de succès et le chemin du fichier est renvoyée avec le statut 200 (OK).
    res.status(200).json({ message: "Image uploadée avec succès.", filePath });
  } catch (error) {
    // Si une erreur se produit, elle est capturée dans le bloc catch 
    // et une réponse JSON avec un message d'erreur est renvoyée avec le statut 500 (Erreur interne du serveur).
    res.status(500).json({ message: (error as Error).message });
  }
}

//Cette méthode est asynchrone et prend deux paramètres : req (la requête) et res (la réponse)
async uploadReconditionneImage(req: Request, res: Response): Promise<void> {
  try {

    //Si aucun fichier n'est fourni dans la requête (req.file est undefined), 
    // une réponse JSON avec un message d'erreur est renvoyée avec le statut 400 (Mauvaise requête)
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier fourni." });
      return;
    }

    // L'ID de l'appareil (deviceId) est extrait du corps de la requête (req.body).
    const { deviceId } = req.body; 
    //Le chemin du fichier uploadé est créé en utilisant le nom du fichier (req.file.filename) et en le préfixant avec /uploads/.
    const filePath = `/uploads/${req.file.filename}`;

    // La méthode updateReconditionneImage du service productService est appelée pour mettre à jour
    //  le chemin de l'image de l'appareil reconditionné dans la base de données avec l'ID de l'appareil et le chemin du fichier.
    await this.productService.updateReconditionneImage(deviceId, filePath);

    //Si l'upload et la mise à jour réussissent, une réponse JSON avec un message de succès et le chemin du fichier est renvoyée avec le statut 200 (OK).
    res.status(200).json({ message: "Image uploadée avec succès.", filePath });
  } catch (error) {
    // Si une erreur se produit, elle est capturée dans le bloc catch et une réponse JSON avec un message d'erreur est renvoyée avec le statut 500
    res.status(500).json({ message: (error as Error).message });
  }
}

}
