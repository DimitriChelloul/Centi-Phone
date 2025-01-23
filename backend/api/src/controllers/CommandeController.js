import { container } from "tsyringe";
import { CommandeService } from "../../../bll/src/services/CommandService";
import { AppError } from "../middleware/errorHandler";
export class CommandeController {
    constructor() {
        // Méthode pour créer une commande et initier un paiement
        this.createCommandeAndProcessPayment = async (req, res, next) => {
            try {
                const { utilisateurId, details, email, amount, currency } = req.body;
                // Étape 1 : Créer la commande
                const commande = await this.commandeService.createCommande(utilisateurId, details, email);
                // Étape 2 : Créer un PaymentIntent via Stripe
                const clientSecret = await this.paymentService.processPayment(commande.id, amount, currency);
                res.status(201).json({
                    message: "Commande créée et paiement initié.",
                    commande,
                    clientSecret,
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Valider un paiement
        this.validatePayment = async (req, res, next) => {
            try {
                const { commandeId } = req.body;
                await this.paymentService.validatePayment(commandeId);
                res.status(200).json({ message: "Paiement validé avec succès." });
            }
            catch (error) {
                next(error);
            }
        };
        // Créer une commande
        this.createCommande = async (req, res, next) => {
            try {
                const { utilisateurId, details, email } = req.body;
                const commande = await this.commandeService.createCommande(utilisateurId, details, email);
                res.status(201).json({ message: "Commande créée avec succès.", commande });
            }
            catch (error) {
                next(error);
            }
        };
        // Obtenir une commande par ID
        this.getCommandeById = async (req, res, next) => {
            try {
                const commandeId = Number(req.params.commandeId);
                const commande = await this.commandeService.getCommandeById(commandeId);
                if (!commande) {
                    throw new AppError("Commande non trouvée", 404); // Lever une erreur personnalisée
                }
                else {
                    res.status(200).json(commande);
                }
            }
            catch (error) {
                next(error);
            }
        };
        // Obtenir les commandes d'un utilisateur
        this.getCommandesByUserId = async (req, res, next) => {
            try {
                const utilisateurId = Number(req.params.utilisateurId);
                const commandes = await this.commandeService.getCommandesByUserId(utilisateurId);
                res.status(200).json(commandes);
            }
            catch (error) {
                next(error);
            }
        };
        // Annuler une commande
        this.cancelCommande = async (req, res, next) => {
            try {
                const commandeId = Number(req.params.commandeId);
                await this.commandeService.cancelCommande(commandeId);
                res.status(200).json({ message: "Commande annulée avec succès." });
            }
            catch (error) {
                next(error);
            }
        };
        // Ajouter un détail à une commande
        this.addCommandeDetail = async (req, res, next) => {
            try {
                const commandeId = Number(req.params.commandeId);
                const detail = req.body;
                const result = await this.commandeService.addCommandeDetail(commandeId, detail);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        // Obtenir les détails d'une commande
        this.getCommandeDetails = async (req, res, next) => {
            try {
                const commandeId = Number(req.params.commandeId);
                const details = await this.commandeService.getCommandeDetails(commandeId);
                res.status(200).json(details);
            }
            catch (error) {
                next(error);
            }
        };
        // Créer une livraison
        this.createLivraison = async (req, res, next) => {
            try {
                const { commandeId, optionId, adresseLivraison } = req.body;
                const livraison = await this.commandeService.createLivraison(commandeId, optionId, adresseLivraison);
                res.status(201).json(livraison);
            }
            catch (error) {
                next(error);
            }
        };
        // Obtenir les options de livraison
        this.getAllDeliveryOptions = async (_req, res, next) => {
            try {
                const options = await this.commandeService.getAllDeliveryOptions();
                res.status(200).json(options);
            }
            catch (error) {
                next(error);
            }
        };
        this.commandeService = container.resolve(CommandeService);
        this.paymentService = container.resolve("IPaymentService");
    }
}
