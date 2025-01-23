import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { CommandeService } from "../../../bll/src/services/CommandService";
import { IPaymentService } from "../../../bll/src/Interfaces/IPaymentService";
import { AppError } from "../middleware/errorHandler";

export class CommandeController {
  //Déclaration des propriétés commandeService et paymentService : Ces propriétés sont privées et de type CommandeService et IPaymentService respectivement.
  //  Elles seront utilisées pour accéder aux méthodes des services de commande et de paiement.
  private commandeService: CommandeService;
  private paymentService: IPaymentService;
//
  constructor() {
    //initialise la propriété commandeService en utilisant le conteneur de dépendances tsyringe pour résoudre une instance de CommandeService.
    this.commandeService = container.resolve(CommandeService);
    // initialise la propriété paymentService en utilisant le conteneur de dépendances tsyringe pour résoudre une instance de IPaymentService.
    this.paymentService = container.resolve<IPaymentService>("IPaymentService");
  }

  // Méthode pour créer une commande et initier un paiement
  // Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs).
  createCommandeAndProcessPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Les propriétés utilisateurId, details, email, amount, et currency sont extraites du corps de la requête.
      const { utilisateurId, details, email, amount, currency } = req.body;

      // Étape 1 : Créer la commande
      // La méthode createCommande du service CommandeService est appelée pour créer une nouvelle commande avec les données extraites
      const commande = await this.commandeService.createCommande(utilisateurId, details, email);

      // Étape 2 : Créer un PaymentIntent via Stripe
      // La méthode processPayment du service IPaymentService est appelée pour créer un PaymentIntent via Stripe avec l'ID de la commande, le montant et la devise.
      const clientSecret = await this.paymentService.processPayment(commande.id!, amount, currency);
//Si les deux étapes réussissent, une réponse JSON avec un message de succès et les détails de la commande est renvoyée avec le statut 201
      res.status(201).json({
        message: "Commande créée et paiement initié.",
        commande,
       //clientSecret,
      });
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Valider un paiement
  //Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  validatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // La propriété commandeId est extraite du corps de la requête.
     const { commandeId } = req.body;
//La méthode validatePayment du service IPaymentService est appelée pour valider le paiement avec l'ID de la commande.
     await this.paymentService.validatePayment(commandeId);
//Si la validation réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 200.
     res.status(200).json({ message: "Paiement validé avec succès." });
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
   }
  };


  // Créer une commande
  //Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  createCommande = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      //Les propriétés utilisateurId, details, et email sont extraites du corps de la requête.
      const { utilisateurId, details, email } = req.body;
      //La méthode createCommande du service CommandeService est appelée pour créer une nouvelle commande avec les données extraites.
      const commande = await this.commandeService.createCommande(utilisateurId, details, email);
      //Si la création réussit, une réponse JSON avec un message de succès et les détails de la commande est renvoyée avec le statut 201.
      res.status(201).json({ message: "Commande créée avec succès.", commande });
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  // Obtenir une commande par ID
   //Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  getCommandeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // La propriété commandeId est extraite des paramètres de la requête et convertie en nombre.
      const commandeId = Number(req.params.commandeId);
      // La méthode getCommandeById du service CommandeService est appelée pour récupérer la commande avec l'ID spécifié.
      const commande = await this.commandeService.getCommandeById(commandeId);
      //Si la commande n'est pas trouvée, une erreur personnalisée est levée avec le statut 404
      if (!commande) {
        throw new AppError("Commande non trouvée", 404); // Lever une erreur personnalisée
      } else {
        //Si la commande est trouvée, elle est renvoyée dans une réponse JSON avec le statut 200.
        res.status(200).json(commande);
      }
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Obtenir les commandes d'un utilisateur
  // Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  getCommandesByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // La propriété utilisateurId est extraite des paramètres de la requête et convertie en nombre
      const utilisateurId = Number(req.params.utilisateurId);
      // La méthode getCommandesByUserId du service CommandeService est appelée pour récupérer les commandes de l'utilisateur avec l'ID spécifié.
      const commandes = await this.commandeService.getCommandesByUserId(utilisateurId);
      //Si la récupération réussit, les commandes sont renvoyées dans une réponse JSON avec le statut 200
      res.status(200).json(commandes);
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Annuler une commande
  //Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  cancelCommande = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // La propriété commandeId est extraite des paramètres de la requête et convertie en nombre.
      const commandeId = Number(req.params.commandeId);
      //La méthode cancelCommande du service CommandeService est appelée pour annuler la commande avec l'ID spécifié.
      await this.commandeService.cancelCommande(commandeId);
      // Si l'annulation réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 200.
      res.status(200).json({ message: "Commande annulée avec succès." });
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Ajouter un détail à une commande
  // Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  addCommandeDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      //La propriété commandeId est extraite des paramètres de la requête et convertie en nombre.
      const commandeId = Number(req.params.commandeId);
      // La propriété detail est extraite du corps de la requête.
      const detail = req.body;
      //La méthode addCommandeDetail du service CommandeService est appelée pour ajouter un détail à la commande avec l'ID spécifié.
      const result = await this.commandeService.addCommandeDetail(commandeId, detail);
      //Si l'ajout réussit, le résultat est renvoyé dans une réponse JSON avec le statut 201.
      res.status(201).json(result);
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  
  // Obtenir les détails d'une commande
  // Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  getCommandeDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      //La propriété commandeId est extraite des paramètres de la requête et convertie en nombre
      const commandeId = Number(req.params.commandeId);
      // La méthode getCommandeDetails du service CommandeService est appelée pour récupérer les détails de la commande avec l'ID spécifié.
      const details = await this.commandeService.getCommandeDetails(commandeId);
      // Si la récupération réussit, les détails sont renvoyés dans une réponse JSON avec le statut 200.
      res.status(200).json(details);
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  // Créer une livraison
   // Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  createLivraison = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Les propriétés commandeId, optionId, et adresseLivraison sont extraites du corps de la requête.
      const { commandeId, optionId, adresseLivraison } = req.body;
      // La méthode createLivraison du service CommandeService est appelée pour créer une nouvelle livraison avec les données extraites.
      const livraison = await this.commandeService.createLivraison(commandeId, optionId, adresseLivraison);
      //Si la création réussit, la livraison est renvoyée dans une réponse JSON avec le statut 201.
      res.status(201).json(livraison);
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  // Obtenir les options de livraison
  // Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  getAllDeliveryOptions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      //La méthode getAllDeliveryOptions du service CommandeService est appelée pour récupérer toutes les options de livraison.
      const options = await this.commandeService.getAllDeliveryOptions();
      //Si la récupération réussit, les options de livraison sont renvoyées dans une réponse JSON avec le statut 200.
      res.status(200).json(options);
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };
}
