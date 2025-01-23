import { Commande } from '../../../domain/src/entities/commandes';
import { CommandDetail } from '../../../domain/src/entities/details_commandes';
import { Livraison } from '../../../domain/src/entities/livraisons';
import { OptionsDeLivraison } from '../../../domain/src/entities/options_livraison';

export interface ICommandService {
  // Gestion des commandes
  createCommande(utilisateurId: number, details: CommandDetail[], email: string): Promise<Commande>;
  getCommandeById(commandeId: number): Promise<Commande | null>;
  getCommandesByUserId(utilisateurId: number): Promise<Commande[]>;
  cancelCommande(commandeId: number): Promise<void>;

  // Gestion des détails de commande
  getCommandeDetails(commandeId: number): Promise<CommandDetail[]>;
  addCommandeDetail(commandeId: number, detail: CommandDetail): Promise<CommandDetail>;

  // Gestion des livraisons
  createLivraison(commandeId: number, optionId: number, adresseLivraison: string): Promise<Livraison>;
  getLivraisonByCommandeId(commandeId: number): Promise<Livraison | null>;
  getAllDeliveryOptions(): Promise<OptionsDeLivraison[]>;
}
