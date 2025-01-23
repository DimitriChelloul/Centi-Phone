import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { RepairService } from "../../../bll/src/services/ReparationService";
import { Devis } from "../../../domain/src/entities/devis";

export class ReparationController {

  // utilisée pour accéder aux méthodes du service de réparation
  private repairService: RepairService;
//Constructeur de la classe ReparationController 
  constructor() {
    try {
      // Essaie de résoudre une instance de RepairService en utilisant le conteneur de dépendances tsyringe
      this.repairService = container.resolve(RepairService);
      // Si la résolution réussit, un message de succès est loggé
      console.log("RepairService résolu avec succès.");
    } catch (error) {
      //Si une erreur se produit lors de la résolution du service, elle est loggée et relancée pour éviter une instanciation incorrecte du contrôleur
      console.error("Erreur lors de la résolution de RepairService :", error);
      throw error; // Lancer une erreur pour éviter une instanciation incorrecte.
    }
  }

  // Créer un RDV
  // Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs)
  createRdv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Les propriétés utilisateurId, email, et dateRdv sont extraites du corps de la requête
      const { utilisateurId, email, dateRdv } = req.body;
      // La méthode createRdv du service RepairService est appelée avec les données extraites
      await this.repairService.createRdv(utilisateurId, email, new Date(dateRdv));
      //Si l'appel au service réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 201
      res.status(201).json({ message: "Rendez-vous créé avec succès." });
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Ajouter un suivi de réparation
  // Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  addSuiviReparation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Les propriétés rdvId et statut sont extraites du corps de la requête.
      const { rdvId, statut } = req.body;
      // La méthode addSuiviReparation du service RepairService est appelée avec les données extraites.
      await this.repairService.addSuiviReparation(rdvId, statut);
      //Si l'appel au service réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 201
      res.status(201).json({ message: "Suivi de réparation ajouté." });
    } catch (error) {
      //Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };

  // Mettre à jour le statut d'une réparation
  //Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  updateStatutReparation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Les propriétés rendezVousId, statut, clientEmail, et clientName sont extraites du corps de la requête
      const { rendezVousId, statut, clientEmail, clientName } = req.body;
      // La méthode updateStatutReparation du service RepairService est appelée avec les données extraites
      await this.repairService.updateStatutReparation(rendezVousId, statut, clientEmail, clientName);
      //Si l'appel au service réussit, une réponse JSON avec un message de succès est renvoyée avec le statut 200
      res.status(200).json({ message: "Statut de réparation mis à jour avec succès." });
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur.
      next(error);
    }
  };

  // Créer un devis
  //Cette méthode est asynchrone et prend trois paramètres : req, res, et next.
  createDevis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // La propriété utilisateurId et le reste des données (devisData) sont extraites du corps de la requête
      const { utilisateurId, ...devisData } = req.body;
      // La méthode createDevis du service RepairService est appelée avec les données extraites.
      const devis: Devis = await this.repairService.createDevis(utilisateurId, devisData);
      //Si l'appel au service réussit, une réponse JSON avec le devis créé est renvoyée avec le statut 201
      res.status(201).json(devis);
    } catch (error) {
      // Si une erreur se produit, elle est passée à la fonction next pour être gérée par le middleware d'erreur
      next(error);
    }
  };
}
