import { container } from "tsyringe";
import { RepairService } from "../../../bll/src/services/ReparationService";
export class ReparationController {
    constructor() {
        // Créer un RDV
        this.createRdv = async (req, res, next) => {
            try {
                const { utilisateurId, email, dateRdv } = req.body;
                await this.repairService.createRdv(utilisateurId, email, new Date(dateRdv));
                res.status(201).json({ message: "Rendez-vous créé avec succès." });
            }
            catch (error) {
                next(error);
            }
        };
        // Ajouter un suivi de réparation
        this.addSuiviReparation = async (req, res, next) => {
            try {
                const { rdvId, statut } = req.body;
                await this.repairService.addSuiviReparation(rdvId, statut);
                res.status(201).json({ message: "Suivi de réparation ajouté." });
            }
            catch (error) {
                next(error);
            }
        };
        // Mettre à jour le statut d'une réparation
        this.updateStatutReparation = async (req, res, next) => {
            try {
                const { rendezVousId, statut, clientEmail, clientName } = req.body;
                await this.repairService.updateStatutReparation(rendezVousId, statut, clientEmail, clientName);
                res.status(200).json({ message: "Statut de réparation mis à jour avec succès." });
            }
            catch (error) {
                next(error);
            }
        };
        // Créer un devis
        this.createDevis = async (req, res, next) => {
            try {
                const { utilisateurId, ...devisData } = req.body;
                const devis = await this.repairService.createDevis(utilisateurId, devisData);
                res.status(201).json(devis);
            }
            catch (error) {
                next(error);
            }
        };
        this.repairService = container.resolve(RepairService);
    }
}
