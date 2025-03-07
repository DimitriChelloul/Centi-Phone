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
      throw error; // Lancer une erreur pour éviter une instanciation incorrecte.
    }
  }

  // Créer un RDV
  // Cette méthode est asynchrone et prend trois paramètres : req (la requête), res (la réponse), et next (la fonction de gestion des erreurs)
  createRdv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("🔹 [DEBUG] Données reçues dans createRdv :", req.body);

        // Vérifiez si l'utilisateur est authentifié
        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: "Utilisateur non authentifié." });
            return;
        }

        console.log('Utilisateur authentifié dans createRdv:', req.user);
        console.log('Données reçues dans createRdv:', req.body);

        // Vérifiez les données avant traitement
        if (!req.body.dateRdv) {
            console.error("❌ [ERROR] Date du rendez-vous manquante.");
            res.status(400).json({ message: "Date du rendez-vous manquante." });
            return;
        }

        const id = req.user?.userId || req.body.utilisateurId;
        const { description, dateRdv } = req.body;


        if (!id) {
          console.error("❌ [ERROR] ID utilisateur manquant !");
           res.status(401).json({ message: "Utilisateur non authentifié." });
      }
        console.log("🔹 [DEBUG] Données reçues dans createRdv:", req.body);

        // Vérification et conversion de la date
        let parsedDate;

        console.log("🔹 [DEBUG] Valeur brute de dateRdv reçue:", dateRdv);
        if (typeof dateRdv === "string") {
            parsedDate = new Date(dateRdv);
        } else {
            parsedDate = dateRdv;
        }

        if (isNaN(parsedDate?.getTime())) {
          console.error("❌ [ERROR] Format de date invalide :", dateRdv);
          res.status(400).json({ message: "Format de date invalide." });
          return;
      }

        console.log("🔹 [DEBUG] Date après conversion :", parsedDate);

        // Appeler le service pour créer un rendez-vous
        await this.repairService.createRdv(id, description, parsedDate);

        res.status(201).json({ message: "Rendez-vous créé avec succès." });
    } catch (error) {
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
