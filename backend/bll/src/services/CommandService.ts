import { injectable, inject } from "tsyringe";
import { ICommandRepository } from "../../../dal/src/dal/Interfaces/ICommandeRepository";
import { ICommandService } from "../Interfaces/ICommandeService";
import { Commande } from '../../../domain/src/entities/commandes';
import { CommandDetail } from '../../../domain/src/entities/details_commandes';
import { Livraison } from '../../../domain/src/entities/livraisons';
import { OptionsDeLivraison } from '../../../domain/src/entities/options_livraison';
import { IUnitOfWork } from "../../../dal/src/dal/Interfaces/IUnitOfWork"
import { IEmailService } from "../Interfaces/IEmailService";
import { AppErrorGen } from "../../../domain/src/utils/AppErrorGen";


// La classe CommandeService est déclarée et exportée pour être utilisée ailleurs dans l'application.
//  Elle implémente l'interface ICommandService. Le décorateur @injectable() est utilisé pour indiquer que cette classe peut être injectée comme dépendance.
@injectable()
export class CommandeService implements ICommandService {
  
  //Constructeur de la classe CommandeService : Le constructeur prend trois paramètres :
  //commandRepo de type ICommandRepository : Injecté avec le décorateur @inject("ICommandRepository").
  //unitOfWork de type IUnitOfWork : Injecté avec le décorateur @inject("IUnitOfWork").
  //emailService de type IEmailService : Injecté avec le décorateur @inject("IEmailService").
constructor(@inject("ICommandRepository") private commandRepo: ICommandRepository,
  @inject("IUnitOfWork") private unitOfWork: IUnitOfWork,
  @inject("IEmailService") private emailService: IEmailService) {}

 //Cette méthode est asynchrone et prend trois paramètres : utilisateurId (l'ID de l'utilisateur),
 //  details (les détails de la commande), et email (l'adresse email pour envoyer la confirmation). Elle retourne une promesse de type Commande.
 async createCommande(utilisateurId: number, details: CommandDetail[], email: string): Promise<Commande> {

  // La méthode start de l'unité de travail est appelée pour démarrer une nouvelle transaction.
  await this.unitOfWork.start();

  try {
    // Étape 1 :  La méthode reduce est utilisée pour calculer le total de la commande en additionnant
    //  les prix unitaires multipliés par les quantités de chaque détail de la commande.
    const total = details.reduce((sum, detail) => sum + detail.prixUnitaire * detail.quantite, 0);

    // Étape 2 :  La méthode createCommand du repository de commandes est appelée pour créer une nouvelle commande avec les informations fournies.
    const commande = await this.unitOfWork.commandRepository.createCommand({
      utilisateurId,
      dateCommande: new Date(),
      total,
      statutPaiement: "en attente"
    });
// L'ID de la commande nouvellement créée est extrait.
    const commandeId = commande.id!;

    // Étape 3 :  Pour chaque détail de la commande,
    //  l'ID de la commande est associé et le détail est ajouté à la commande en utilisant la méthode addCommandDetail du repository de commandes.
    for (const detail of details) {
      detail.commandeId = commande.id!; // Associer les détails à la commande
      await this.unitOfWork.commandRepository.addCommandDetail(detail);

      // Pour chaque produit commandé, le stock est mis à jour en utilisant la méthode updateStock du repository de produits.
      //  Le stock est décrémenté de la quantité commandée.
      if (detail.produitAVendreId) {
        await this.unitOfWork.productRepository.updateStock(detail.produitAVendreId, -detail.quantite);
      } else if (detail.appareilReconditionneId) {
        await this.unitOfWork.productRepository.updateStock(detail.appareilReconditionneId, -detail.quantite);
      }
    }

    // Étape 4 : Valider la transaction
    await this.unitOfWork.commit();

    // Étape 5 : Envoyer un e-mail de confirmation
    const emailHtml = `
      <h1>Confirmation de votre commande</h1>
      <p>Merci pour votre commande n°<strong>${commande.id}</strong>.</p>
      <p>Montant total : <strong>${total.toFixed(2)} €</strong></p>
      <p>Votre commande est en cours de traitement et nous vous tiendrons informé de sa progression.</p>
      <br />
      <p>Merci pour votre confiance,</p>
      <p>L'équipe de réparation.</p>
    `;
    await this.emailService.sendEmail(email, "Confirmation de votre commande", emailHtml);

    return commande; // Retourner la commande créée
  } catch (error) {
    await this.unitOfWork.rollback();
    throw new Error(`Erreur lors de la création de la commande : ${(error as Error).message}`);
  }
}

// Cette méthode est asynchrone et prend un paramètre : commandeId (l'ID de la commande). Elle retourne une promesse de type Commande ou null.
  async getCommandeById(commandeId: number): Promise<Commande | null> {

    // La méthode getCommandById du repository de commandes est appelée pour récupérer la commande par son ID
   const commande = this.commandRepo.getCommandById(commandeId);

   // Si la commande n'est pas trouvée, une erreur personnalisée est levée avec le statut 404.
    if (!commande) {
      throw new AppErrorGen("Commande non trouvée", 404); 
    }

    return commande;

  }

  // Cette méthode est asynchrone et prend un paramètre : utilisateurId (l'ID de l'utilisateur). Elle retourne une promesse de type tableau de Commande.
  async getCommandesByUserId(utilisateurId: number): Promise<Commande[]> {
    // La méthode getCommandsByUserId du repository de commandes est appelée pour récupérer les commandes de l'utilisateur par son ID.
    return this.commandRepo.getCommandsByUserId(utilisateurId);
  }

  //Cette méthode est asynchrone et prend un paramètre : commandeId (l'ID de la commande). Elle retourne une promesse de type void.
  async cancelCommande(commandeId: number): Promise<void> {
    // La méthode deleteCommand du repository de commandes est appelée pour annuler la commande par son ID.
    await this.commandRepo.deleteCommand(commandeId);
  }

  //Cette méthode est asynchrone et prend un paramètre : commandeId (l'ID de la commande). Elle retourne une promesse de type tableau de CommandDetail.
  async getCommandeDetails(commandeId: number): Promise<CommandDetail[]> {
    // La méthode getCommandDetails du repository de commandes est appelée pour récupérer les détails de la commande par son ID.
    return this.commandRepo.getCommandDetails(commandeId);
  }

  // Cette méthode est asynchrone et prend deux paramètres :
  //  commandeId (l'ID de la commande) et detail (le détail de la commande). Elle retourne une promesse de type CommandDetail.
  async addCommandeDetail(commandeId: number, detail: CommandDetail): Promise<CommandDetail> {
    // L'ID de la commande est associé au détail
    detail.commandeId = commandeId;
    // la méthode addCommandDetail du repository de commandes est appelée pour ajouter le détail à la commande.
    return this.commandRepo.addCommandDetail(detail);
  }

  // Cette méthode est asynchrone et prend trois paramètres : commandeId (l'ID de la commande), optionId (l'ID de l'option de livraison), 
  // et adresseLivraison (l'adresse de livraison). Elle retourne une promesse de type Livraison.
  async createLivraison(commandeId: number, optionId: number, adresseLivraison: string): Promise<Livraison> {
    //Une nouvelle instance de Livraison est créée avec les informations fournies
    const livraison = new Livraison({
      commandeId,
      optionLivraisonId: optionId,
      adresseLivraison,
      statut: "en attente",
    });
    // la méthode createLivraison du repository de commandes est appelée pour créer la livraison.
    return this.commandRepo.createLivraison(livraison);
  }

  //Cette méthode est asynchrone et prend un paramètre : commandeId (l'ID de la commande). Elle retourne une promesse de type Livraison ou null.
  async getLivraisonByCommandeId(commandeId: number): Promise<Livraison | null> {
    // La méthode getLivraisonByCommandId du repository de commandes est appelée pour récupérer la livraison par l'ID de la commande
    return this.commandRepo.getLivraisonByCommandId(commandeId);
  }

  //Cette méthode est asynchrone et ne prend aucun paramètre. Elle retourne une promesse de type tableau de OptionsDeLivraison.
  async getAllDeliveryOptions(): Promise<OptionsDeLivraison[]> {
    // La méthode getAllDeliveryOptions du repository de commandes est appelée pour récupérer toutes les options de livraison.
    return this.commandRepo.getAllDeliveryOptions();
  }
}
