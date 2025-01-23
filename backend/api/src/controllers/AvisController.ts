import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ReviewService } from "../../../bll/src/services/AvisService";
import { Avis } from "../../../domain/src/entities/avis";

export class AvisController {
  // Cette propriété est privée et de type ReviewService. Elle sera utilisée pour accéder aux méthodes du service d'avis.
  private reviewService: ReviewService;

  constructor() {
    // initialise la propriété reviewService en utilisant le conteneur de dépendances tsyringe pour résoudre une instance de ReviewService.
    this.reviewService = container.resolve(ReviewService);
  }

  // Créer un avis
  //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Les propriétés utilisateurId, commentaire, note, produitId, et type sont extraites du corps de la requête.
      const { utilisateurId, commentaire, note, produitId, type } = req.body;
      //Un objet avis de type Avis est créé avec les propriétés extraites. Les IDs produitAVendreId et appareilReconditionneId sont définis en fonction du type de produit.
      const avis: Avis = {
        utilisateurId,
          commentaire,
          note,
          produitAVendreId: type === "produit" ? produitId : undefined,
          appareilReconditionneId: type === "appareil" ? produitId : undefined,
          
      };
//La méthode createReview du service ReviewService est appelée pour créer un nouvel avis avec les données extraites.
      const newReview = await this.reviewService.createReview(utilisateurId, avis);
      //Si la création réussit, le nouvel avis est renvoyé dans une réponse JSON avec le statut 201.
      res.status(201).json(newReview);
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  // Récupérer les avis pour un produit ou un appareil
   //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
  getReviewsByProductId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // La propriété productId est extraite des paramètres de la requête et convertie en nombre
      const productId = Number(req.params.productId);
      // La propriété type est extraite des paramètres de la requête et typée comme "produit" ou "appareil".
      const type = req.query.type as "produit" | "appareil";
      // La méthode getReviewsByProductId du service ReviewService est appelée pour récupérer les avis pour le produit ou l'appareil spécifié.
      const reviews = await this.reviewService.getReviewsByProductId(productId, type);
      // Si la récupération réussit, les avis sont renvoyés dans une réponse JSON avec le statut 200.
      res.status(200).json(reviews);
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  // Récupérer un avis par ID
   //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
  getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // La propriété reviewId est extraite des paramètres de la requête et convertie en nombre.
      const reviewId = Number(req.params.reviewId);
      // La méthode getReviewById du service ReviewService est appelée pour récupérer l'avis avec l'ID spécifié.
      const review = await this.reviewService.getReviewById(reviewId);
      // Si l'avis n'est pas trouvé, une réponse JSON avec un message d'erreur est renvoyée avec le statut 404.
      if (!review) {
         res.status(404).json({ message: "Avis non trouvé." });
      }
      //Si l'avis est trouvé, il est renvoyé dans une réponse JSON avec le statut 200.
      res.status(200).json(review);
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  // Supprimer un avis
   //Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // La propriété reviewId est extraite des paramètres de la requête et convertie en nombre.
      const reviewId = Number(req.params.reviewId);
      // La méthode deleteReview du service ReviewService est appelée pour supprimer l'avis avec l'ID spécifié.
      await this.reviewService.deleteReview(reviewId);
      //Si la suppression réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 200.
      res.status(200).json({ message: "Avis supprimé avec succès." });
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };
}
